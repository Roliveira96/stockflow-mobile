import { StyleSheet } from "react-native";

import { fonteMono, raios, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    botao: {
      width: 34,
      height: 34,
      borderRadius: raios.sm - 2,
      alignItems: "center",
      justifyContent: "center",
    },
    botaoCompacto: {
      width: 30,
      height: 30,
    },
    botaoDiminuir: {
      backgroundColor: cores.neutroFundoForte,
    },
    botaoAumentar: {
      backgroundColor: cores.botaoPrimario,
    },
    botaoDesabilitado: {
      opacity: 0.35,
    },
    valor: {
      minWidth: 22,
      textAlign: "center",
      fontSize: 14,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    valorAtivo: {
      color: cores.primaria,
    },
  });
}
