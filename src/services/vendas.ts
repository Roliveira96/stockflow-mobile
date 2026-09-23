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
  ProdutoComprado,
  RascunhoPedido,
} from "@/types";
import { mesclarBaixas, planejarBaixaFefo, planejarEstornoParcial } from "@/utils/lote";
import { formatarMoeda } from "@/utils/moeda";
import { calcularSubtotal, gerarNumeroPedido, rotuloFormaPagamento } from "@/utils/venda";

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

async function estornarEstoque(
  item: ItemPedido,
  quantidade: number,
  descricao: string,
  data: string
): Promise<BaixaLote[]> {
  const respostaProduto = await api.get<Produto>(`/produtos/${item.produtoId}`);
  const produto = respostaProduto.data;
  const novaQuantidade = produto.quantidade + quantidade;
  const { devolucoes, lotesRestantes } = planejarEstornoParcial(
    item.quantidade,
    item.lotes,
    quantidade
  );

  await api.patch(`/produtos/${produto.id}`, { quantidade: novaQuantidade, atualizadoEm: data });

  for (const devolucao of devolucoes) {
    const respostaLote = await api.get<Lote>(`/lotes/${devolucao.loteId}`).catch(() => null);

    if (respostaLote) {
      await api.patch(`/lotes/${devolucao.loteId}`, {
        saldoRestante: respostaLote.data.saldoRestante + devolucao.quantidade,
      });
    }
  }

  await registrarLogQuantidade(produto, novaQuantidade, descricao, data);

  return lotesRestantes;
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
    await estornarEstoque(item, item.quantidade, `cancelamento ${pedido.numero}`, agora);
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

function descreverAlteracoes(pedido: Pedido, rascunho: RascunhoPedido): string[] {
  const alteracoes: string[] = [];

  rascunho.itens.forEach((item) => {
    const original = pedido.itens.find((atual) => atual.produtoId === item.produtoId);
    if (!original) {
      alteracoes.push(`+ ${item.nome} (${item.quantidade} un.)`);
    } else if (original.quantidade !== item.quantidade) {
      alteracoes.push(`${item.nome}: ${original.quantidade} → ${item.quantidade} un.`);
    }
  });

  pedido.itens.forEach((original) => {
    if (!rascunho.itens.some((item) => item.produtoId === original.produtoId)) {
      alteracoes.push(`− ${original.nome}`);
    }
  });

  pedido.itensBalcao.forEach((original) => {
    if (!rascunho.itensBalcao.includes(original)) {
      alteracoes.push(`− ${original.nome}`);
    }
  });

  const clienteAntes = `${pedido.cliente.nome}${pedido.cliente.cpf ? ` (CPF)` : ""}`;
  const clienteDepois = `${rascunho.cliente.nome}${rascunho.cliente.cpf ? ` (CPF)` : ""}`;
  if (
    pedido.cliente.cpf !== rascunho.cliente.cpf ||
    pedido.cliente.nome !== rascunho.cliente.nome
  ) {
    alteracoes.push(`Cliente: ${clienteAntes} → ${clienteDepois}`);
  }

  if (pedido.formaPagamento !== rascunho.formaPagamento) {
    alteracoes.push(
      `Pagamento: ${rotuloFormaPagamento(pedido.formaPagamento)} → ${rotuloFormaPagamento(rascunho.formaPagamento)}`
    );
  }

  if (Math.abs(pedido.desconto - rascunho.desconto) >= 0.005) {
    alteracoes.push(
      `Desconto: ${formatarMoeda(pedido.desconto)} → ${formatarMoeda(rascunho.desconto)}`
    );
  }

  if ((pedido.observacao ?? "") !== rascunho.observacao) {
    alteracoes.push(rascunho.observacao ? "Observação atualizada" : "Observação removida");
  }

  return alteracoes;
}

export async function editarPedido(
  pedido: Pedido,
  rascunho: RascunhoPedido,
  operador: string
): Promise<Pedido> {
  const agora = new Date().toISOString();
  const descricaoLog = `edição ${pedido.numero}`;
  const alteracoes = descreverAlteracoes(pedido, rascunho);
  const itensAtualizados: ItemPedido[] = [];

  for (const item of rascunho.itens) {
    const original = pedido.itens.find((atual) => atual.produtoId === item.produtoId);
    const quantidadeOriginal = original?.quantidade ?? 0;
    const diferenca = item.quantidade - quantidadeOriginal;
    let lotes = original?.lotes ?? [];

    if (diferenca > 0) {
      const { baixas } = await baixarEstoque(item.produtoId, diferenca, descricaoLog, agora);
      lotes = mesclarBaixas(lotes, baixas);
    } else if (diferenca < 0 && original) {
      lotes = await estornarEstoque(original, -diferenca, descricaoLog, agora);
    }

    itensAtualizados.push({
      ...item,
      embalado: original ? original.embalado && diferenca === 0 : false,
      lotes,
    });
  }

  for (const original of pedido.itens) {
    if (!rascunho.itens.some((item) => item.produtoId === original.produtoId)) {
      await estornarEstoque(original, original.quantidade, descricaoLog, agora);
    }
  }

  const subtotal =
    rascunho.itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0) +
    rascunho.itensBalcao.reduce((soma, item) => soma + item.preco, 0);

  const atualizado = await atualizarPedido(pedido.id, {
    cliente: rascunho.cliente,
    itens: itensAtualizados,
    itensBalcao: rascunho.itensBalcao,
    formaPagamento: rascunho.formaPagamento,
    observacao: rascunho.observacao,
    subtotal,
    desconto: rascunho.desconto,
    total: Math.max(0, subtotal - rascunho.desconto),
    eventos: adicionarEvento(pedido, {
      tipo: "editado",
      data: agora,
      responsavel: operador,
      descricao: alteracoes.join("; ") || "Sem alterações",
    }),
  });

  await salvarCliente(rascunho.cliente).catch(() => undefined);

  return atualizado;
}

export async function listarProdutosCompradosPorCliente(cpf: string): Promise<ProdutoComprado[]> {
  const resposta = await api.get<Pedido[]>("/pedidos", {
    params: { "cliente.cpf": cpf, status: "PAGO" },
  });
  const porProduto = new Map<string, ProdutoComprado>();

  resposta.data.forEach((pedido) => {
    const dataCompra = pedido.pagoEm ?? pedido.criadoEm;

    pedido.itens.forEach((item) => {
      const atual = porProduto.get(item.produtoId);

      if (!atual) {
        porProduto.set(item.produtoId, {
          produtoId: item.produtoId,
          nome: item.nome,
          icone: item.icone,
          vezes: 1,
          quantidadeTotal: item.quantidade,
          ultimaCompra: dataCompra,
          ultimoPreco: item.precoUnitario,
        });
        return;
      }

      atual.vezes += 1;
      atual.quantidadeTotal += item.quantidade;

      if (dataCompra > atual.ultimaCompra) {
        atual.ultimaCompra = dataCompra;
        atual.ultimoPreco = item.precoUnitario;
      }
    });
  });

  return [...porProduto.values()].sort((a, b) => b.ultimaCompra.localeCompare(a.ultimaCompra));
}
