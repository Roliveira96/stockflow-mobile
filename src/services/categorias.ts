import { api } from "@/services/api";
import type { Categoria, DadosCategoria } from "@/types";

export async function listarCategorias(): Promise<Categoria[]> {
  const resposta = await api.get<Categoria[]>("/categorias");
  return resposta.data;
}

export async function criarCategoria(dados: DadosCategoria): Promise<Categoria> {
  const resposta = await api.post<Categoria>("/categorias", dados);
  return resposta.data;
}
