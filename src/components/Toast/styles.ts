import { StyleSheet } from "react-native";

import { raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    toast: {
      position: "absolute",
      alignSelf: "center",
      maxWidth: 420,
      bottom: 96,
      backgroundColor: cores.toastFundo,
      borderRadius: raios.md,
      paddingHorizontal: 16,
      paddingVertical: 11,
      zIndex: 999,
      ...sombra.flutuante,
    },
    texto: {
      fontSize: 13,
      fontWeight: "600",
      color: cores.toastTexto,
      textAlign: "center",
    },
  });
}
