import { api } from "@/services/api";
import type { Produto, RespostaPaginada, StatusFiltro } from "@/types";

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
  const params: Record<string, string | number | boolean> = {
    _page: pagina,
    _limit: ITENS_POR_PAGINA,
  };

  if (filtro.length > 0) {
    params.nome_like = filtro;
  }

  if (filtroStatus === "ativos") {
    params.ativo = true;
  } else if (filtroStatus === "inativos") {
    params.ativo = false;
  } else if (filtroStatus === "sem-estoque") {
    params.quantidade = 0;
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

export async function buscarSugestoesProdutos(busca: string): Promise<Produto[]> {
  const filtro = busca.trim();

  if (filtro.length === 0) return [];

  const resposta = await api.get<Produto[]>("/produtos", {
    params: { nome_like: filtro, _limit: ITENS_SUGESTAO },
  });

  return resposta.data;
}
