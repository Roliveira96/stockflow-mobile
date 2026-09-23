import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, fonteMono, raios, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: 14,
    },
    linhaLabel: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.textoSecundario,
    },
    obrigatorio: {
      color: cores.perigo,
    },
    contador: {
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    input: {
      width: "100%",
      minHeight: ALVO_TOQUE_MINIMO + 2,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.sm,
      paddingHorizontal: 14,
      fontSize: 14,
      fontWeight: "500",
      color: cores.textoPrimario,
      backgroundColor: cores.superficieAlternativa,
      outlineStyle: "solid",
      outlineWidth: 0,
    },
    inputMultilinha: {
      minHeight: 110,
      paddingTop: 12,
      paddingBottom: 12,
      fontWeight: "400",
      lineHeight: 20,
    },
    inputMono: {
      fontFamily: fonteMono,
    },
    inputFocado: {
      borderColor: cores.primaria,
      backgroundColor: cores.superficie,
      boxShadow: `0px 0px 0px 3px ${cores.primariaFundo}`,
    },
    inputComErro: {
      borderColor: cores.perigo,
      backgroundColor: cores.superficie,
    },
    erro: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: "600",
      color: cores.perigo,
    },
  });
}
