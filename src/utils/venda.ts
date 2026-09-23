import type { FormaPagamento, ItemBalcao, ItemCarrinho, TipoDesconto } from "@/types";

import { extrairDigitos } from "./moeda";

export const DESCONTO_MAXIMO_PERCENTUAL = 50;

export const NOME_CONSUMIDOR_PADRAO = "Consumidor não identificado";

export const FORMAS_PAGAMENTO: { valor: FormaPagamento; rotulo: string; icone: string }[] = [
  { valor: "PIX", rotulo: "PIX", icone: "⚡" },
  { valor: "CARTAO_CREDITO", rotulo: "Cartão crédito", icone: "💳" },
  { valor: "CARTAO_DEBITO", rotulo: "Cartão débito", icone: "💳" },
  { valor: "DINHEIRO", rotulo: "Dinheiro", icone: "💵" },
];

export const ITENS_BALCAO: (ItemBalcao & { icone: string })[] = [
  { nome: "Embalagem para presente", preco: 5, icone: "🎁" },
  { nome: "Garantia estendida 1 ano", preco: 25, icone: "🛡️" },
];

export function rotuloFormaPagamento(forma: FormaPagamento): string {
  return FORMAS_PAGAMENTO.find((opcao) => opcao.valor === forma)?.rotulo ?? forma;
}

export function calcularSubtotal(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
}

export function calcularDesconto(subtotal: number, tipo: TipoDesconto, valorInformado: number) {
  const limite = subtotal * (DESCONTO_MAXIMO_PERCENTUAL / 100);
  const bruto = tipo === "percentual" ? subtotal * (valorInformado / 100) : valorInformado;
  const excedeu =
    tipo === "percentual" ? valorInformado > DESCONTO_MAXIMO_PERCENTUAL : bruto > limite;

  return { desconto: Math.min(bruto, limite), excedeu };
}

export function formatarCpf(texto: string): string {
  const digitos = extrairDigitos(texto).slice(0, 11);

  return digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function validarCpf(texto: string): boolean {
  const digitos = extrairDigitos(texto);

  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;

  const calcularVerificador = (base: string) => {
    const soma = base
      .split("")
      .reduce((total, digito, indice) => total + Number(digito) * (base.length + 1 - indice), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiro = calcularVerificador(digitos.slice(0, 9));
  const segundo = calcularVerificador(digitos.slice(0, 10));

  return primeiro === Number(digitos[9]) && segundo === Number(digitos[10]);
}

export function gerarNumeroPedido(sequencia: number): string {
  return `PED-${String(sequencia).padStart(4, "0")}`;
}

export const MOTIVOS_CANCELAMENTO = [
  "Cliente esqueceu o dinheiro ou o cartão",
  "Pagamento no cartão não foi aprovado",
  "Cliente desistiu da compra",
  "Erro nos itens ou quantidades do pedido",
];

export function formatarTelefone(texto: string): string {
  const digitos = extrairDigitos(texto).slice(0, 11);

  if (digitos.length <= 2) return digitos.length ? `(${digitos}` : "";
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function validarTelefone(texto: string): boolean {
  const digitos = extrairDigitos(texto);
  return digitos.length === 10 || digitos.length === 11;
}
