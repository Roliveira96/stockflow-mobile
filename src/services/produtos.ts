import { api } from "@/services/api";
import type { Lote, Produto, RespostaPaginada, StatusFiltro } from "@/types";
import { calcularJanelaVencendo } from "@/utils/lote";

export const ITENS_POR_PAGINA = 10;
const ITENS_SUGESTAO = 5;

interface ParametrosBuscaPaginada {
  pagina: number;
  busca: string;
  filtroStatus: StatusFiltro;
}

export async function buscarProdutosPaginado({
  pagina,
  busca,
  filtroStatus,
}: ParametrosBuscaPaginada): Promise<RespostaPaginada<Produto>> {
  const filtro = busca.trim();
  const params = new URLSearchParams({
    _page: String(pagina),
    _limit: String(ITENS_POR_PAGINA),
  });

  if (filtro.length > 0) {
    params.set("nome_like", filtro);
  }

  if (filtroStatus === "disponiveis") {
    params.set("ativo", "true");
    params.set("quantidade_gte", "1");
  } else if (filtroStatus === "vencendo") {
    const idsVencendo = await buscarIdsProdutosVencendo();

    if (idsVencendo.length === 0) {
      return montarRespostaVazia(pagina, filtro);
    }

    idsVencendo.forEach((id) => params.append("id", id));
  } else if (filtroStatus === "ativos") {
    params.set("ativo", "true");
  } else if (filtroStatus === "inativos") {
    params.set("ativo", "false");
  } else if (filtroStatus === "sem-estoque") {
    params.set("quantidade_lte", "0");
  }

  const resposta = await api.get<Produto[]>("/produtos", { params });
  const totalItens = Number(resposta.headers["x-total-count"] ?? resposta.data.length);
  const totalPaginas = Math.max(1, Math.ceil(totalItens / ITENS_POR_PAGINA));

  return {
    itens: resposta.data,
    paginaAtual: pagina,
    itensPorPagina: ITENS_POR_PAGINA,
    totalItens,
    quantidadeNaPagina: resposta.data.length,
    filtro,
    ehPrimeiraPagina: pagina <= 1,
    ehUltimaPagina: pagina >= totalPaginas,
  };
}

async function buscarIdsProdutosVencendo(): Promise<string[]> {
  const { inicio, fim } = calcularJanelaVencendo();
  const resposta = await api.get<Lote[]>("/lotes", {
    params: { validade_gte: inicio, validade_lte: fim, saldoRestante_gte: 1 },
  });

  return [...new Set(resposta.data.map((lote) => String(lote.produtoId)))];
}

function montarRespostaVazia(pagina: number, filtro: string): RespostaPaginada<Produto> {
  return {
    itens: [],
    paginaAtual: pagina,
    itensPorPagina: ITENS_POR_PAGINA,
    totalItens: 0,
    quantidadeNaPagina: 0,
    filtro,
    ehPrimeiraPagina: true,
    ehUltimaPagina: true,
  };
}

export async function buscarSugestoesProdutos(busca: string): Promise<Produto[]> {
  const filtro = busca.trim();

  if (filtro.length === 0) return [];

  const resposta = await api.get<Produto[]>("/produtos", {
    params: { nome_like: filtro, _limit: ITENS_SUGESTAO },
  });

  return resposta.data;
}

export async function buscarLotesComValidadeProxima(): Promise<Lote[]> {
  const { fim } = calcularJanelaVencendo();
  const resposta = await api.get<Lote[]>("/lotes", {
    params: { validade_lte: fim, saldoRestante_gte: 1 },
  });

  return resposta.data;
}
