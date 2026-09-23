import { useMemo } from "react";
import Svg, { Path, Rect } from "react-native-svg";

import { useTema } from "@/contexts/TemaContext";
import type { QrCodeProps } from "@/types";
import { gerarCaminhoQr } from "@/utils/qrcode";

export function QrCode({ valor, tamanho }: QrCodeProps) {
  const { cores } = useTema();
  const qr = useMemo(() => gerarCaminhoQr(valor), [valor]);

  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${qr.tamanho} ${qr.tamanho}`}
      accessibilityLabel="QR Code de pagamento PIX"
    >
      <Rect width={qr.tamanho} height={qr.tamanho} fill={cores.qrFundo} />
      <Path d={qr.caminho} fill={cores.qrModulo} />
    </Svg>
  );
}
