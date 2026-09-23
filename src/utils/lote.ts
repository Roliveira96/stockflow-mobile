import type { BaixaLote, Lote, LoteComPrazo, ResumoVencimento, StatusLote } from "@/types";

export const MARGEM_ALVO_PADRAO = 40;
export const DIAS_LIMITE_VENCENDO = 30;

export function gerarCodigoLote(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `LOTE-${ano}${mes}${dia}-${aleatorio}`;
}

function formatarDataIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function calcularJanelaVencendo(): { inicio: string; fim: string } {
  const hoje = new Date();
  const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + DIAS_LIMITE_VENCENDO);

  return { inicio: formatarDataIso(hoje), fim: formatarDataIso(limite) };
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

export function resumirVencimentos(lotes: Lote[]): ResumoVencimento {
  const lotesComPrazo: LoteComPrazo[] = lotes
    .filter((lote) => lote.validade && lote.saldoRestante > 0)
    .map((lote) => ({ lote, diasParaVencer: calcularDiasParaVencer(lote.validade as string) }))
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);

  const lotesVencidos = lotesComPrazo.filter((item) => item.diasParaVencer < 0);
  const lotesVencendo = lotesComPrazo.filter(
    (item) => item.diasParaVencer >= 0 && item.diasParaVencer <= DIAS_LIMITE_VENCENDO
  );
  const somarSaldo = (itens: LoteComPrazo[]) =>
    itens.reduce((soma, item) => soma + item.lote.saldoRestante, 0);

  return {
    lotesVencendo,
    lotesVencidos,
    unidadesVencendo: somarSaldo(lotesVencendo),
    unidadesVencidas: somarSaldo(lotesVencidos),
    menorPrazoDias: lotesVencendo.length > 0 ? lotesVencendo[0].diasParaVencer : null,
  };
}

export function agruparVencimentosPorProduto(lotes: Lote[]): Record<string, ResumoVencimento> {
  const lotesPorProduto = new Map<string, Lote[]>();

  lotes.forEach((lote) => {
    const produtoId = String(lote.produtoId);
    lotesPorProduto.set(produtoId, [...(lotesPorProduto.get(produtoId) ?? []), lote]);
  });

  const resultado: Record<string, ResumoVencimento> = {};

  lotesPorProduto.forEach((lotesDoProduto, produtoId) => {
    const resumo = resumirVencimentos(lotesDoProduto);

    if (resumo.lotesVencendo.length > 0 || resumo.lotesVencidos.length > 0) {
      resultado[produtoId] = resumo;
    }
  });

  return resultado;
}

export function descreverPrazo(dias: number): string {
  if (dias < 0) return `venceu há ${Math.abs(dias)} dia${Math.abs(dias) === 1 ? "" : "s"}`;
  if (dias === 0) return "vence hoje";
  return `vence em ${dias} dia${dias === 1 ? "" : "s"}`;
}

export function planejarBaixaFefo(lotes: Lote[], quantidade: number): BaixaLote[] {
  const disponiveis = lotes
    .filter((lote) => lote.saldoRestante > 0)
    .sort((a, b) => {
      if (a.validade && b.validade) return a.validade.localeCompare(b.validade);
      if (a.validade) return -1;
      if (b.validade) return 1;
      return a.criadoEm.localeCompare(b.criadoEm);
    });

  const baixas: BaixaLote[] = [];
  let restante = quantidade;

  for (const lote of disponiveis) {
    if (restante <= 0) break;

    const consumido = Math.min(lote.saldoRestante, restante);
    baixas.push({ loteId: String(lote.id), codigo: lote.codigo, quantidade: consumido });
    restante -= consumido;
  }

  return baixas;
}
