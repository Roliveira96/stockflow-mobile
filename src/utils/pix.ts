import { LOJA } from "@/constants/loja";
import { normalizarTexto } from "@/utils/texto";

function campo(id: string, valor: string): string {
  return `${id}${String(valor.length).padStart(2, "0")}${valor}`;
}

function crc16(texto: string): string {
  let crc = 0xffff;

  for (let indice = 0; indice < texto.length; indice += 1) {
    crc ^= texto.charCodeAt(indice) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function limparTexto(texto: string, limite: number): string {
  return normalizarTexto(texto)
    .replace(/[^a-z0-9 ]/g, "")
    .toUpperCase()
    .slice(0, limite);
}

export function gerarIdentificadorPix(numeroPedido: string): string {
  return numeroPedido.replace(/[^A-Za-z0-9]/g, "").slice(0, 25);
}

export function gerarPayloadPix(valor: number, numeroPedido: string): string {
  const contaPix = campo("00", "br.gov.bcb.pix") + campo("01", LOJA.chavePix);
  const semCrc =
    campo("00", "01") +
    campo("26", contaPix) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("54", valor.toFixed(2)) +
    campo("58", "BR") +
    campo("59", limparTexto(LOJA.nomePix, 25)) +
    campo("60", limparTexto(LOJA.cidadePix, 15)) +
    campo("62", campo("05", gerarIdentificadorPix(numeroPedido))) +
    "6304";

  return semCrc + crc16(semCrc);
}
