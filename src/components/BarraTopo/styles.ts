import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    barra: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: ALVO_TOQUE_MINIMO + 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      backgroundColor: cores.fundo,
    },
    botaoVoltar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      height: ALVO_TOQUE_MINIMO,
      paddingRight: 8,
    },
    textoVoltar: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoSecundario,
    },
  });
}
