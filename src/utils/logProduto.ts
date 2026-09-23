import type { AlteracaoCampo, DadosProduto, Produto } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

const ROTULOS_CAMPOS: Record<keyof DadosProduto, string> = {
  nome: "Nome",
  codigoBarras: "Código de barras",
  codigoAuxiliar: "Código auxiliar",
  quantidade: "Quantidade",
  preco: "Preço",
  precoCusto: "Preço de custo",
  descricao: "Descrição",
  categoria: "Categoria",
  categoriaIcone: "Ícone da categoria",
  ativo: "Ativo para venda",
};

const CAMPOS_COMPARADOS: (keyof DadosProduto)[] = [
  "nome",
  "codigoBarras",
  "codigoAuxiliar",
  "quantidade",
  "preco",
  "precoCusto",
  "descricao",
  "categoria",
  "ativo",
];

function formatarValorCampo(campo: keyof DadosProduto, valor: unknown): string {
  if (campo === "preco") return formatarMoeda(Number(valor));
  if (campo === "precoCusto") return valor ? formatarMoeda(Number(valor)) : "(vazio)";
  if (campo === "ativo") return valor ? "Sim" : "Não";
  if (campo === "descricao" || campo === "codigoAuxiliar") return valor ? String(valor) : "(vazio)";
  if (campo === "categoria") return valor ? String(valor) : "(nenhuma)";
  return String(valor);
}

export function compararProdutos(anterior: Produto, atual: DadosProduto): AlteracaoCampo[] {
  const alteracoes: AlteracaoCampo[] = [];

  for (const campo of CAMPOS_COMPARADOS) {
    const valorAnterior = anterior[campo];
    const valorAtual = atual[campo];

    if (String(valorAnterior ?? "") !== String(valorAtual ?? "")) {
      alteracoes.push({
        campo: ROTULOS_CAMPOS[campo],
        de: formatarValorCampo(campo, valorAnterior),
        para: formatarValorCampo(campo, valorAtual),
      });
    }
  }

  return alteracoes;
}
