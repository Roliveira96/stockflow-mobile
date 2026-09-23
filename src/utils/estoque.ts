import type { NivelEstoque } from "@/types";

export const LIMITE_ULTIMAS_UNIDADES = 5;
export const LIMITE_ESTOQUE_BAIXO = 20;

export function calcularNivelEstoque(quantidade: number): NivelEstoque {
  if (quantidade < LIMITE_ULTIMAS_UNIDADES) return "critico";
  if (quantidade < LIMITE_ESTOQUE_BAIXO) return "baixo";
  return "normal";
}
