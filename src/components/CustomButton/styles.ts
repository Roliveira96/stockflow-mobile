import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    botao: {
      width: "100%",
      minHeight: 52,
      borderRadius: raios.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 16,
    },
    compacto: {
      minHeight: ALVO_TOQUE_MINIMO + 2,
      paddingHorizontal: 12,
      gap: 6,
    },
    primaria: {
      backgroundColor: cores.botaoPrimario,
      ...sombra.botao,
    },
    sucesso: {
      backgroundColor: cores.botaoSucesso,
      ...sombra.botaoSucesso,
    },
    perigo: {
      backgroundColor: cores.perigoFundo,
    },
    neutro: {
      backgroundColor: cores.neutroFundoForte,
    },
    desabilitado: {
      opacity: 0.45,
      boxShadow: "none",
    },
    texto: {
      fontSize: 15,
      fontWeight: "700",
      color: cores.textoSobreCor,
    },
    textoCompacto: {
      fontSize: 13,
    },
    textoPerigo: {
      color: cores.perigo,
    },
    textoNeutro: {
      color: cores.neutroTexto,
    },
  });
}
