import type { Lote, StatusLote } from "@/types";

export const MARGEM_ALVO_PADRAO = 40;
const DIAS_LIMITE_VENCENDO = 30;

export function gerarCodigoLote(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `LOTE-${ano}${mes}${dia}-${aleatorio}`;
}

export function calcularDiasParaVencer(validade: string): number {
  const hoje = new Date();
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const dataValidade = new Date(`${validade}T00:00:00`);

  return Math.round((dataValidade.getTime() - hojeSemHora.getTime()) / (1000 * 60 * 60 * 24));
}

export function calcularStatusLote(validade: string | null): StatusLote {
  if (!validade) return "regular";

  const diasRestantes = calcularDiasParaVencer(validade);

  if (diasRestantes < 0) return "vencido";
  if (diasRestantes <= DIAS_LIMITE_VENCENDO) return "vencendo";
  return "regular";
}

export function calcularCustoMedioPonderado(lotes: Lote[]): number {
  const saldoTotal = lotes.reduce((soma, lote) => soma + lote.saldoRestante, 0);

  if (saldoTotal === 0) return 0;

  const custoTotal = lotes.reduce(
    (soma, lote) => soma + lote.saldoRestante * lote.custoUnitario,
    0
  );

  return custoTotal / saldoTotal;
}

export function calcularMargem(precoVenda: number, custoUnitario: number): number {
  if (precoVenda <= 0) return 0;
  return ((precoVenda - custoUnitario) / precoVenda) * 100;
}

export function sugerirPrecoVenda(custoUnitario: number, margemAlvo: number): number {
  if (margemAlvo >= 100) return custoUnitario;
  return custoUnitario / (1 - margemAlvo / 100);
}
