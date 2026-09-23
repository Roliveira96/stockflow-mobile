import { StyleSheet } from "react-native";

import { fonteMono, raios, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    opcaoAnonimo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: raios.md,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: cores.borda,
    },
    opcaoAnonimoTitulo: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    opcaoAnonimoTexto: {
      marginTop: 1,
      fontSize: 11,
      color: cores.textoTerciario,
    },
    opcaoAnonimoAcao: {
      fontSize: 13,
      fontWeight: "800",
      color: cores.primaria,
    },
    divisor: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    divisorLinha: {
      flex: 1,
      height: 1,
      backgroundColor: cores.borda,
    },
    divisorTexto: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: cores.textoTerciario,
    },
    sugestoes: {
      marginTop: -6,
      marginBottom: 14,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.primariaFundoForte,
      backgroundColor: cores.superficie,
      overflow: "hidden",
    },
    sugestoesTitulo: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: cores.primaria,
      backgroundColor: cores.primariaFundo,
    },
    sugestao: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      minHeight: 50,
      paddingHorizontal: 12,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
    },
    sugestaoIcone: {
      width: 28,
      height: 28,
      borderRadius: raios.pill,
      backgroundColor: cores.primariaFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    sugestaoNome: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    sugestaoDetalhe: {
      marginTop: 1,
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    botaoSecundario: {
      flex: 1,
      width: undefined,
    },
    botaoPrincipal: {
      flex: 1.5,
      width: undefined,
    },
  });
}
