import { StyleSheet } from "react-native";

import type { Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    conteudoTela: {
      backgroundColor: cores.fundo,
    },
  });
}
