import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    vazio: {
      fontSize: 13,
      color: cores.textoTerciario,
    },
    linha: {
      padding: 14,
      marginBottom: 10,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    linhaEsgotada: {
      opacity: 0.7,
    },
    linhaTopo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    codigo: {
      flex: 1,
      fontSize: 13,
      fontWeight: "700",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    selo: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: cores.sucessoFundo,
    },
    seloTexto: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.sucesso,
    },
    seloVencendo: {
      backgroundColor: cores.alertaFundo,
    },
    seloTextoVencendo: {
      color: cores.alerta,
    },
    seloVencido: {
      backgroundColor: cores.perigoFundo,
    },
    seloTextoVencido: {
      color: cores.perigo,
    },
    grade: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
    },
    campo: {
      width: "50%",
    },
    campoRotulo: {
      fontSize: 11,
      color: cores.textoTerciario,
    },
    campoValor: {
      fontSize: 13,
      fontWeight: "600",
      fontFamily: fonteMono,
      color: cores.textoSecundario,
      marginTop: 2,
    },
  });
}
