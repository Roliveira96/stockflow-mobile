import { LOJA } from "@/constants/loja";
import type { Pedido } from "@/types";

import { extrairDigitos, formatarMoeda } from "./moeda";
import { NOME_CONSUMIDOR_PADRAO } from "./venda";

export function montarMensagemPix(pedido: Pedido, payload: string): string {
  const saudacao =
    pedido.cliente.nome && pedido.cliente.nome !== NOME_CONSUMIDOR_PADRAO
      ? `Olá, ${pedido.cliente.nome.split(" ")[0]}!`
      : "Olá!";

  const itens = pedido.itens.map(
    (item) =>
      `• ${item.quantidade}x ${item.nome} — ${formatarMoeda(item.precoUnitario * item.quantidade)}`
  );
  const balcao = pedido.itensBalcao.map((item) => `• ${item.nome} — ${formatarMoeda(item.preco)}`);

  return [
    `${saudacao} Segue o pagamento PIX do seu pedido *${pedido.numero}* na ${LOJA.nomeFantasia}.`,
    "",
    "*Itens*",
    ...itens,
    ...balcao,
    "",
    `Subtotal: ${formatarMoeda(pedido.subtotal)}`,
    ...(pedido.desconto > 0 ? [`Desconto: - ${formatarMoeda(pedido.desconto)}`] : []),
    `*Total: ${formatarMoeda(pedido.total)}*`,
    "",
    "*PIX copia e cola*",
    payload,
    "",
    `Chave PIX: ${LOJA.chavePix}`,
    "",
    "_Pagamento fictício (demonstração)._",
  ].join("\n");
}

export function montarLinkWhatsapp(mensagem: string, telefone?: string): string {
  const digitos = telefone ? extrairDigitos(telefone) : "";
  const destino = digitos ? (digitos.startsWith("55") ? digitos : `55${digitos}`) : "";

  return `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`;
}
