import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    card: {
      gap: 8,
      padding: 14,
      marginBottom: 10,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    linha: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    linhaEsquerda: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    numero: {
      fontSize: 13,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
    selo: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: raios.pill,
    },
    seloAguardando: {
      backgroundColor: cores.alertaFundo,
    },
    seloPago: {
      backgroundColor: cores.sucessoFundo,
    },
    seloTexto: {
      fontSize: 10,
      fontWeight: "800",
    },
    seloTextoAguardando: {
      color: cores.alerta,
    },
    seloTextoPago: {
      color: cores.sucesso,
    },
    seloCancelado: {
      backgroundColor: cores.perigoFundo,
    },
    seloTextoCancelado: {
      color: cores.perigo,
    },
    totalCancelado: {
      color: cores.textoTerciario,
      textDecorationLine: "line-through",
    },
    observacao: {
      fontSize: 12,
      color: cores.alerta,
    },
    motivo: {
      fontSize: 12,
      color: cores.perigo,
    },
    total: {
      fontSize: 14,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    cliente: {
      flex: 1,
      fontSize: 12,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    qtdItens: {
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    rodape: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
    },
    data: {
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    acao: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.primaria,
    },
  });
}
