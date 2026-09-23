import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { LOJA } from "@/constants/loja";
import type { Pedido } from "@/types";
import { formatarData } from "@/utils/data";
import { formatarMoeda } from "@/utils/moeda";
import { gerarIdentificadorPix } from "@/utils/pix";
import { formatarCpf, rotuloFormaPagamento } from "@/utils/venda";

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linha(rotulo: string, valor: string, classe = ""): string {
  return `<div class="linha ${classe}"><span>${escapar(rotulo)}</span><span>${escapar(valor)}</span></div>`;
}

export function montarHtmlComprovante(pedido: Pedido): string {
  const eventoPago = [...(pedido.eventos ?? [])].reverse().find((evento) => evento.tipo === "pago");
  const dataPagamento = pedido.pagoEm ?? eventoPago?.data ?? new Date().toISOString();
  const quantidadeItens = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);

  const itens = pedido.itens
    .map(
      (item, indice) => `
        <div class="item">
          <div class="item-nome">${String(indice + 1).padStart(3, "0")} ${escapar(item.nome)}</div>
          <div class="linha"><span>${item.quantidade} UN x ${escapar(formatarMoeda(item.precoUnitario))}</span><span>${escapar(formatarMoeda(item.precoUnitario * item.quantidade))}</span></div>
        </div>`
    )
    .join("");

  const balcao = pedido.itensBalcao
    .map(
      (item) => `
        <div class="item">
          <div class="item-nome">SERV ${escapar(item.nome)}</div>
          <div class="linha"><span>1 UN x ${escapar(formatarMoeda(item.preco))}</span><span>${escapar(formatarMoeda(item.preco))}</span></div>
        </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Comprovante ${escapar(pedido.numero)}</title>
<style>
  @page { margin: 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Courier New", Courier, monospace; color: #000; font-size: 12px; }
  .cupom { width: 80mm; margin: 0 auto; padding: 4mm 3mm; }
  .centro { text-align: center; }
  .forte { font-weight: bold; }
  .titulo { font-size: 15px; font-weight: bold; }
  .separador { border-top: 1px dashed #000; margin: 6px 0; }
  .linha { display: flex; justify-content: space-between; gap: 8px; }
  .linha span:last-child { text-align: right; white-space: nowrap; }
  .item { margin: 3px 0; }
  .item-nome { word-break: break-word; }
  .total { font-size: 15px; font-weight: bold; }
  .aviso { border: 1px solid #000; padding: 4px; margin: 6px 0; text-align: center; font-weight: bold; }
  .pequeno { font-size: 10px; }
</style>
</head>
<body>
  <div class="cupom">
    <div class="centro titulo">${escapar(LOJA.nomeFantasia)}</div>
    <div class="centro pequeno">${escapar(LOJA.razaoSocial)}</div>
    <div class="centro pequeno">CNPJ ${escapar(LOJA.cnpj)} · IE ${escapar(LOJA.inscricaoEstadual)}</div>
    <div class="centro pequeno">${escapar(LOJA.endereco)} · ${escapar(LOJA.cidade)}</div>
    <div class="centro pequeno">Tel. ${escapar(LOJA.telefone)}</div>

    <div class="aviso">COMPROVANTE DE VENDA<br />SEM VALOR FISCAL · DADOS FICTÍCIOS</div>

    ${linha("Pedido", pedido.numero, "forte")}
    ${linha("Data/hora", formatarData(dataPagamento))}
    ${linha("Vendedor", pedido.vendedor)}
    ${linha("Caixa", eventoPago?.responsavel ?? "-")}

    <div class="separador"></div>
    <div class="forte">CONSUMIDOR</div>
    <div>${escapar(pedido.cliente.nome)}</div>
    <div>${pedido.cliente.cpf ? `CPF ${escapar(formatarCpf(pedido.cliente.cpf))}` : "CPF não informado"}</div>

    <div class="separador"></div>
    <div class="linha forte"><span># DESCRIÇÃO</span><span>VALOR</span></div>
    ${itens}
    ${balcao}

    <div class="separador"></div>
    ${linha("Qtd. total de itens", String(quantidadeItens + pedido.itensBalcao.length))}
    ${linha("Subtotal", formatarMoeda(pedido.subtotal))}
    ${linha("Desconto", `- ${formatarMoeda(pedido.desconto)}`)}
    <div class="linha total"><span>TOTAL</span><span>${escapar(formatarMoeda(pedido.total))}</span></div>

    <div class="separador"></div>
    ${linha("Forma de pagamento", rotuloFormaPagamento(pedido.formaPagamento))}
    ${linha("Valor pago", formatarMoeda(pedido.total))}
    ${
      pedido.formaPagamento === "PIX"
        ? `${linha("ID transação PIX", gerarIdentificadorPix(pedido.numero))}${linha("Chave PIX", LOJA.chavePix)}`
        : ""
    }
    ${pedido.observacao ? `<div class="separador"></div><div class="forte">OBS.</div><div>${escapar(pedido.observacao)}</div>` : ""}

    <div class="separador"></div>
    <div class="centro">Obrigado pela preferência!</div>
    <div class="centro pequeno">Emitido por StockFlow em ${escapar(formatarData(new Date().toISOString()))}</div>
  </div>
</body>
</html>`;
}

function imprimirNaWeb(html: string): Promise<void> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        iframe.remove();
        resolve();
      }, 1000);
    };

    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}

export async function gerarComprovante(pedido: Pedido): Promise<void> {
  const html = montarHtmlComprovante(pedido);

  if (Platform.OS === "web") {
    await imprimirNaWeb(html);
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
      dialogTitle: `Comprovante ${pedido.numero}`,
    });
  }
}
