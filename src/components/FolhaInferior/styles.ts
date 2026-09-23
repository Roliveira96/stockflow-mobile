import { StyleSheet } from "react-native";

import { raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: cores.overlayTranslucido,
      justifyContent: "flex-end",
    },
    overlayPressable: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    painel: {
      width: "100%",
      maxWidth: 480,
      maxHeight: "90%",
      alignSelf: "center",
      backgroundColor: cores.superficie,
      borderTopLeftRadius: raios.lg,
      borderTopRightRadius: raios.lg,
      borderWidth: 1,
      borderColor: cores.borda,
      ...sombra.flutuante,
    },
    flex: {
      flex: 1,
    },
    cabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    cabecalhoTextos: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    cabecalhoIcone: {
      width: 34,
      height: 34,
      borderRadius: raios.sm,
      backgroundColor: cores.primariaFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    titulo: {
      fontSize: 15,
      fontWeight: "800",
      color: cores.textoPrimario,
    },
    subtitulo: {
      fontSize: 11,
      color: cores.textoTerciario,
    },
    botaoFechar: {
      width: 32,
      height: 32,
      borderRadius: raios.pill,
      backgroundColor: cores.neutroFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: {
      flexGrow: 0,
    },
    conteudo: {
      padding: 20,
      gap: 14,
    },
    rodape: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
    },
  });
}
