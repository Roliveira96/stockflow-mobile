import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    flex: {
      flex: 1,
    },
    conteudo: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    titulo: {
      fontSize: 21,
      fontWeight: "800",
      letterSpacing: -0.4,
      color: cores.textoPrimario,
    },
    subtitulo: {
      fontSize: 13,
      color: cores.textoTerciario,
      marginTop: 2,
      marginBottom: 16,
    },
    botaoTopo: {
      height: ALVO_TOQUE_MINIMO,
      paddingHorizontal: 8,
      justifyContent: "center",
    },
    botaoTopoPerigo: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.perigo,
    },
    carregando: {
      marginTop: 40,
    },
  });
}
