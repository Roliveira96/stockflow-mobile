import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { QrCode } from "@/components/QrCode";
import { LOJA } from "@/constants/loja";
import { useTema } from "@/contexts/TemaContext";
import type { PagamentoPixProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";
import { gerarPayloadPix } from "@/utils/pix";

import { criarEstilos } from "./styles";

const TAMANHO_QR = 200;

export function PagamentoPix({ valor, numeroPedido }: PagamentoPixProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const payload = useMemo(() => gerarPayloadPix(valor, numeroPedido), [valor, numeroPedido]);

  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <Text style={styles.icone}>⚡</Text>
        <View style={styles.flex}>
          <Text style={styles.titulo}>Pagamento via PIX</Text>
          <Text style={styles.subtitulo}>Mostre o QR Code para o cliente escanear</Text>
        </View>
      </View>

      <View style={styles.moldura}>
        <QrCode valor={payload} tamanho={TAMANHO_QR} />
      </View>

      <Text style={styles.valor}>{formatarMoeda(valor)}</Text>
      <Text style={styles.recebedor}>
        {LOJA.nomeFantasia} · chave {LOJA.chavePix}
      </Text>

      <View style={styles.copiaECola}>
        <Text style={styles.copiaEColaRotulo}>PIX copia e cola</Text>
        <Text style={styles.copiaEColaTexto} selectable>
          {payload}
        </Text>
      </View>

      <View style={styles.aviso}>
        <Ionicons name="information-circle-outline" size={15} color={cores.alerta} />
        <Text style={styles.avisoTexto}>
          QR Code fictício para demonstração: nenhum valor é cobrado. Confirme o recebimento
          manualmente.
        </Text>
      </View>
    </View>
  );
}
