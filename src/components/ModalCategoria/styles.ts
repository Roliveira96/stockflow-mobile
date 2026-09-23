import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, raios, sombra, type Cores } from "@/constants/theme";

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
      alignSelf: "center",
      backgroundColor: cores.superficie,
      borderTopLeftRadius: raios.lg,
      borderTopRightRadius: raios.lg,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: 20,
      paddingBottom: 28,
      ...sombra.flutuante,
    },
    cabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 14,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    cabecalhoTextos: {
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
    linhaIcone: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 18,
    },
    campoIcone: {
      width: 56,
      height: ALVO_TOQUE_MINIMO,
    },
    opcoesIcone: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
    },
    opcaoIcone: {
      width: 36,
      height: 36,
      borderRadius: raios.sm,
      backgroundColor: cores.neutroFundo,
      borderWidth: 1,
      borderColor: cores.neutroFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    opcaoIconeSelecionada: {
      borderColor: cores.primaria,
      backgroundColor: cores.primariaFundo,
    },
    opcaoIconeTexto: {
      fontSize: 16,
    },
    acoes: {
      flexDirection: "row",
      gap: 10,
      marginTop: 4,
    },
    botaoAcao: {
      flex: 1,
      width: undefined,
    },
    botaoAcaoPrincipal: {
      flex: 1.5,
      width: undefined,
    },
  });
}
