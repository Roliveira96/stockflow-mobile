import type { FormaPagamento, Pedido } from "@/types";
import { rotuloFormaPagamento } from "@/utils/venda";

export function obterSaudacao(data = new Date()): string {
  const hora = data.getHours();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

export function formatarDataExtenso(data = new Date()): string {
  const texto = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(data);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function ehMesmoDia(dataIso: string, hoje = new Date()): boolean {
  if (!dataIso) return false;
  const d = new Date(dataIso);
  return (
    d.getFullYear() === hoje.getFullYear() &&
    d.getMonth() === hoje.getMonth() &&
    d.getDate() === hoje.getDate()
  );
}

export function formatarHora(dataIso: string): string {
  if (!dataIso) return "--:--";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dataIso));
}

export interface VendaFormaPagamento {
  forma: FormaPagamento;
  rotulo: string;
  icone: string;
  total: number;
  quantidade: number;
  percentual: number;
}

export interface ResumoDashboard {
  totalVendasHoje: number;
  pedidosHojeTotal: number;
  pedidosPagosHoje: number;
  pedidosAguardandoHoje: number;
  pedidosEmNomeUsuarioHoje: number;
  totalVendasUsuarioHoje: number;
  ticketMedioHoje: number;
  itensVendidosHoje: number;
  formasPagamentoHoje: VendaFormaPagamento[];
  pedidosRecentesHoje: Pedido[];
}

export function calcularResumoDashboard(
  pedidos: Pedido[],
  nomeUsuario: string,
  hoje = new Date()
): ResumoDashboard {
  const nomeNormalizado = nomeUsuario.trim().toLowerCase();

  const pedidosHoje = pedidos.filter(
    (p) => ehMesmoDia(p.criadoEm, hoje) || (p.pagoEm && ehMesmoDia(p.pagoEm, hoje))
  );

  const pedidosPagos = pedidosHoje.filter((p) => p.status === "PAGO");
  const pedidosAguardando = pedidosHoje.filter((p) => p.status === "AGUARDANDO");

  const totalVendasHoje = pedidosPagos.reduce((acc, p) => acc + p.total, 0);

  const pedidosDoUsuario = pedidosHoje.filter((p) =>
    p.vendedor ? p.vendedor.trim().toLowerCase() === nomeNormalizado : false
  );
  const pedidosPagosDoUsuario = pedidosDoUsuario.filter((p) => p.status === "PAGO");
  const totalVendasUsuarioHoje = pedidosPagosDoUsuario.reduce((acc, p) => acc + p.total, 0);

  const ticketMedioHoje = pedidosPagos.length > 0 ? totalVendasHoje / pedidosPagos.length : 0;

  const itensVendidosHoje = pedidosPagos.reduce((acc, p) => {
    const qtdItens = p.itens?.reduce((subAcc, item) => subAcc + item.quantidade, 0) ?? 0;
    const qtdBalcao = p.itensBalcao?.length ?? 0;
    return acc + qtdItens + qtdBalcao;
  }, 0);

  const mapaFormas: Record<FormaPagamento, { total: number; quantidade: number }> = {
    PIX: { total: 0, quantidade: 0 },
    CARTAO_CREDITO: { total: 0, quantidade: 0 },
    CARTAO_DEBITO: { total: 0, quantidade: 0 },
    DINHEIRO: { total: 0, quantidade: 0 },
  };

  for (const pedido of pedidosPagos) {
    if (mapaFormas[pedido.formaPagamento]) {
      mapaFormas[pedido.formaPagamento].total += pedido.total;
      mapaFormas[pedido.formaPagamento].quantidade += 1;
    }
  }

  const iconesForma: Record<FormaPagamento, string> = {
    PIX: "flash-outline",
    CARTAO_CREDITO: "card-outline",
    CARTAO_DEBITO: "card-outline",
    DINHEIRO: "cash-outline",
  };

  const formasPagamentoHoje: VendaFormaPagamento[] = (
    ["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "DINHEIRO"] as FormaPagamento[]
  ).map((forma) => {
    const dados = mapaFormas[forma];
    return {
      forma,
      rotulo: rotuloFormaPagamento(forma),
      icone: iconesForma[forma],
      total: dados.total,
      quantidade: dados.quantidade,
      percentual: totalVendasHoje > 0 ? (dados.total / totalVendasHoje) * 100 : 0,
    };
  });

  const pedidosRecentesHoje = [...pedidosHoje]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 6);

  return {
    totalVendasHoje,
    pedidosHojeTotal: pedidosHoje.length,
    pedidosPagosHoje: pedidosPagos.length,
    pedidosAguardandoHoje: pedidosAguardando.length,
    pedidosEmNomeUsuarioHoje: pedidosDoUsuario.length,
    totalVendasUsuarioHoje,
    ticketMedioHoje,
    itensVendidosHoje,
    formasPagamentoHoje,
    pedidosRecentesHoje,
  };
}
