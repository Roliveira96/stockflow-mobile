import type { AlteracaoCampo, DadosProduto, Produto } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

const ROTULOS_CAMPOS: Record<keyof DadosProduto, string> = {
  nome: "Nome",
  codigoBarras: "Código de barras",
  quantidade: "Quantidade",
  preco: "Preço",
  descricao: "Descrição",
  ativo: "Ativo para venda",
};

const CAMPOS_COMPARADOS: (keyof DadosProduto)[] = [
  "nome",
  "codigoBarras",
  "quantidade",
  "preco",
  "descricao",
  "ativo",
];

function formatarValorCampo(campo: keyof DadosProduto, valor: unknown): string {
  if (campo === "preco") return formatarMoeda(Number(valor));
  if (campo === "ativo") return valor ? "Sim" : "Não";
  if (campo === "descricao") return valor ? String(valor) : "(vazio)";
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
