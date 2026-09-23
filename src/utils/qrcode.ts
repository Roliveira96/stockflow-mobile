import QRCode from "qrcode";

export const MARGEM_QR = 2;

export function gerarCaminhoQr(texto: string): { tamanho: number; caminho: string } {
  const { modules } = QRCode.create(texto, { errorCorrectionLevel: "M" });
  const tamanho = modules.size;
  const segmentos: string[] = [];

  for (let linha = 0; linha < tamanho; linha += 1) {
    let coluna = 0;

    while (coluna < tamanho) {
      if (!modules.get(linha, coluna)) {
        coluna += 1;
        continue;
      }

      const inicio = coluna;
      while (coluna < tamanho && modules.get(linha, coluna)) coluna += 1;
      segmentos.push(
        `M${inicio + MARGEM_QR} ${linha + MARGEM_QR}h${coluna - inicio}v1h-${coluna - inicio}z`
      );
    }
  }

  return { tamanho: tamanho + MARGEM_QR * 2, caminho: segmentos.join("") };
}

export function gerarSvgQr(texto: string, pixels: number): string {
  const { tamanho, caminho } = gerarCaminhoQr(texto);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixels}" height="${pixels}" viewBox="0 0 ${tamanho} ${tamanho}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${caminho}" fill="#000"/></svg>`;
}
