import { StyleSheet } from "react-native";

import { raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    container: {
      paddingTop: 14,
      paddingBottom: 12,
      gap: 12,
      zIndex: 10,
    },
    buscaContainer: {
      paddingHorizontal: 16,
      position: "relative",
      zIndex: 10,
    },
    campoBusca: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      height: 48,
      paddingLeft: 14,
      paddingRight: 6,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    campoBuscaFocado: {
      borderColor: cores.primaria,
      boxShadow: `0px 0px 0px 3px ${cores.primariaFundo}`,
    },
    inputBusca: {
      flex: 1,
      height: "100%",
      fontSize: 14,
      fontWeight: "500",
      color: cores.textoPrimario,
      outlineStyle: "solid",
      outlineWidth: 0,
    },
    botaoLimpar: {
      width: 36,
      height: 36,
      borderRadius: raios.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    sugestoesContainer: {
      position: "absolute",
      top: 54,
      left: 16,
      right: 16,
      backgroundColor: cores.superficie,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      overflow: "hidden",
      zIndex: 20,
      ...sombra.flutuante,
    },
    sugestaoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      minHeight: 44,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    sugestaoIcone: {
      fontSize: 15,
    },
    sugestaoTexto: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      color: cores.textoPrimario,
    },
    chips: {
      paddingHorizontal: 16,
      gap: 8,
    },
    chip: {
      height: 34,
      paddingHorizontal: 14,
      borderRadius: raios.pill,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      alignItems: "center",
      justifyContent: "center",
    },
    chipSelecionado: {
      backgroundColor: cores.botaoPrimario,
      borderColor: cores.botaoPrimario,
      ...sombra.botao,
    },
    chipTexto: {
      fontSize: 12,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    chipTextoSelecionado: {
      color: cores.textoSobreCor,
      fontWeight: "700",
    },
  });
}
