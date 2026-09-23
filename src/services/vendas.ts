import { api } from "@/services/api";
import { salvarCliente } from "@/services/clientes";
import type {
  BaixaLote,
  EventoPedido,
  ItemPedido,
  Lote,
  NovoPedido,
  Pedido,
  Produto,
} from "@/types";
import { planejarBaixaFefo } from "@/utils/lote";
import { calcularSubtotal, gerarNumeroPedido } from "@/utils/venda";

export async function listarProdutosVendaveis(): Promise<Produto[]> {
  const resposta = await api.get<Produto[]>("/produtos", {
    params: { ativo: true, _sort: "nome", _order: "asc" },
  });
  return resposta.data;
}

export async function listarPedidos(): Promise<Pedido[]> {
  const resposta = await api.get<Pedido[]>("/pedidos", {
    params: { _sort: "criadoEm", _order: "desc" },
  });
  return resposta.data;
}

export async function atualizarPedido(
  id: string,
  alteracoes: Partial<Omit<Pedido, "id">>
): Promise<Pedido> {
  const resposta = await api.patch<Pedido>(`/pedidos/${id}`, alteracoes);
  return resposta.data;
}

async function proximaSequenciaPedido(): Promise<number> {
  const resposta = await api.get<Pedido[]>("/pedidos", { params: { _limit: 1 } });
  return Number(resposta.headers["x-total-count"] ?? 0) + 1;
}

async function registrarLogQuantidade(
  produto: Produto,
  novaQuantidade: number,
  descricao: string,
  data: string
) {
  await api.post("/logs", {
    produtoId: produto.id,
    produtoNome: produto.nome,
    data,
    alteracoes: [
      {
        campo: `Quantidade (${descricao})`,
        de: String(produto.quantidade),
        para: String(novaQuantidade),
      },
    ],
  });
}

async function baixarEstoque(
  produtoId: string,
  quantidade: number,
  descricao: string,
  data: string
): Promise<{ produto: Produto; baixas: BaixaLote[] }> {
  const [respostaProduto, respostaLotes] = await Promise.all([
    api.get<Produto>(`/produtos/${produtoId}`),
    api.get<Lote[]>("/lotes", { params: { produtoId } }),
  ]);
  const produto = respostaProduto.data;
  const lotes = respostaLotes.data;
  const baixas = planejarBaixaFefo(lotes, quantidade);
  const novaQuantidade = produto.quantidade - quantidade;

  await api.patch(`/produtos/${produto.id}`, { quantidade: novaQuantidade, atualizadoEm: data });

  for (const baixa of baixas) {
    const lote = lotes.find((atual) => String(atual.id) === baixa.loteId);
    await api.patch(`/lotes/${baixa.loteId}`, {
      saldoRestante: Math.max(0, (lote?.saldoRestante ?? 0) - baixa.quantidade),
    });
  }

  await registrarLogQuantidade(produto, novaQuantidade, descricao, data);

  return { produto, baixas };
}

async function estornarEstoque(item: ItemPedido, descricao: string, data: string) {
  const respostaProduto = await api.get<Produto>(`/produtos/${item.produtoId}`);
  const produto = respostaProduto.data;
  const novaQuantidade = produto.quantidade + item.quantidade;

  await api.patch(`/produtos/${produto.id}`, { quantidade: novaQuantidade, atualizadoEm: data });

  for (const baixa of item.lotes) {
    const respostaLote = await api.get<Lote>(`/lotes/${baixa.loteId}`).catch(() => null);

    if (respostaLote) {
      await api.patch(`/lotes/${baixa.loteId}`, {
        saldoRestante: respostaLote.data.saldoRestante + baixa.quantidade,
      });
    }
  }

  await registrarLogQuantidade(produto, novaQuantidade, descricao, data);
}

export async function criarPedido({
  itens,
  cliente,
  desconto,
  formaPagamento,
  vendedor,
}: NovoPedido): Promise<Pedido> {
  const agora = new Date().toISOString();
  const subtotal = calcularSubtotal(itens);
  const numero = gerarNumeroPedido(await proximaSequenciaPedido());
  const itensPedido: ItemPedido[] = [];

  for (const item of itens) {
    const { produto, baixas } = await baixarEstoque(
      item.produto.id,
      item.quantidade,
      `venda ${numero}`,
      agora
    );

    itensPedido.push({
      produtoId: produto.id,
      nome: produto.nome,
      icone: produto.categoriaIcone ?? "📦",
      precoUnitario: item.produto.preco,
      quantidade: item.quantidade,
      embalado: false,
      lotes: baixas,
    });
  }

  const resposta = await api.post<Pedido>("/pedidos", {
    numero,
    criadoEm: agora,
    vendedor,
    cliente,
    itens: itensPedido,
    itensBalcao: [],
    subtotal,
    desconto,
    total: Math.max(0, subtotal - desconto),
    formaPagamento,
    status: "AGUARDANDO",
    pagoEm: null,
    eventos: [{ tipo: "criado", data: agora, responsavel: vendedor }],
  });

  await salvarCliente(cliente).catch(() => undefined);

  return resposta.data;
}

function adicionarEvento(pedido: Pedido, evento: EventoPedido): EventoPedido[] {
  return [...(pedido.eventos ?? []), evento];
}

export async function confirmarPagamento(pedido: Pedido, operador: string): Promise<Pedido> {
  const agora = new Date().toISOString();

  return atualizarPedido(pedido.id, {
    status: "PAGO",
    pagoEm: agora,
    eventos: adicionarEvento(pedido, { tipo: "pago", data: agora, responsavel: operador }),
  });
}

export async function cancelarPedido(
  pedido: Pedido,
  motivo: string,
  operador: string
): Promise<Pedido> {
  const agora = new Date().toISOString();

  const atualizado = await atualizarPedido(pedido.id, {
    status: "CANCELADO",
    motivoCancelamento: motivo,
    eventos: adicionarEvento(pedido, {
      tipo: "cancelado",
      data: agora,
      responsavel: operador,
      motivo,
    }),
  });

  for (const item of pedido.itens) {
    await estornarEstoque(item, `cancelamento ${pedido.numero}`, agora);
  }

  return atualizado;
}

export async function reabrirPedido(pedido: Pedido, operador: string): Promise<Pedido> {
  const agora = new Date().toISOString();
  const itensRebaixados: ItemPedido[] = [];

  for (const item of pedido.itens) {
    const { baixas } = await baixarEstoque(
      item.produtoId,
      item.quantidade,
      `reabertura ${pedido.numero}`,
      agora
    );
    itensRebaixados.push({ ...item, embalado: false, lotes: baixas });
  }

  return atualizarPedido(pedido.id, {
    status: "AGUARDANDO",
    motivoCancelamento: null,
    itens: itensRebaixados,
    eventos: adicionarEvento(pedido, { tipo: "reaberto", data: agora, responsavel: operador }),
  });
}
