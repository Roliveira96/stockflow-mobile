import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { CardPedidoProps } from "@/types";
import { formatarData } from "@/utils/data";
import { formatarMoeda } from "@/utils/moeda";

import { criarEstilos } from "./styles";

export function CardPedido({ pedido, aoAbrir }: CardPedidoProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const pago = pedido.status === "PAGO";
  const cancelado = pedido.status === "CANCELADO";
  const totalItens =
    pedido.itens.reduce((soma, item) => soma + item.quantidade, 0) + pedido.itensBalcao.length;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={aoAbrir}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Abrir pedido ${pedido.numero}`}
    >
      <View style={styles.linha}>
        <View style={styles.linhaEsquerda}>
          <Text style={styles.numero}>{pedido.numero}</Text>
          <View
            style={[
              styles.selo,
              pago ? styles.seloPago : cancelado ? styles.seloCancelado : styles.seloAguardando,
            ]}
          >
            <Text
              style={[
                styles.seloTexto,
                pago
                  ? styles.seloTextoPago
                  : cancelado
                    ? styles.seloTextoCancelado
                    : styles.seloTextoAguardando,
              ]}
            >
              {pago ? "✓ Pago" : cancelado ? "Cancelado" : "Aguardando caixa"}
            </Text>
          </View>
        </View>
        <Text style={[styles.total, cancelado ? styles.totalCancelado : undefined]}>
          {formatarMoeda(pedido.total)}
        </Text>
      </View>

      <View style={styles.linha}>
        <View style={styles.linhaEsquerda}>
          <Ionicons name="person-outline" size={13} color={cores.textoTerciario} />
          <Text style={styles.cliente} numberOfLines={1}>
            {pedido.cliente.nome}
          </Text>
        </View>
        <Text style={styles.qtdItens}>
          {totalItens} ite{totalItens === 1 ? "m" : "ns"}
        </Text>
      </View>

      {pedido.observacao ? (
        <Text style={styles.observacao} numberOfLines={1}>
          📝 {pedido.observacao}
        </Text>
      ) : null}

      {cancelado && pedido.motivoCancelamento ? (
        <Text style={styles.motivo} numberOfLines={2}>
          Motivo: {pedido.motivoCancelamento}
        </Text>
      ) : null}

      <View style={[styles.linha, styles.rodape]}>
        <Text style={styles.data}>
          {pago && pedido.pagoEm
            ? `Pago em ${formatarData(pedido.pagoEm)}`
            : `Criado em ${formatarData(pedido.criadoEm)}`}
        </Text>
        <Text style={styles.acao}>Toque para conferir ›</Text>
      </View>
    </TouchableOpacity>
  );
}
