import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, fonteMono, raios, sombra, type Cores } from "@/constants/theme";

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
    rotuloTopo: {
      fontSize: 12,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
      paddingRight: 4,
    },
    titulo: {
      fontSize: 21,
      fontWeight: "800",
      letterSpacing: -0.4,
      color: cores.textoPrimario,
    },
    subtitulo: {
      fontSize: 13,
      fontWeight: "600",
      color: cores.primaria,
      marginTop: 2,
      marginBottom: 16,
    },
    carregando: {
      marginTop: 40,
    },
    secao: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 2,
      marginBottom: 14,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    secaoTitulo: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: cores.textoTerciario,
      marginBottom: 12,
    },
    linhaCodigo: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    botaoGerar: {
      height: ALVO_TOQUE_MINIMO + 2,
      marginTop: 22,
      paddingHorizontal: 14,
      borderRadius: raios.sm,
      backgroundColor: cores.primariaFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    botaoGerarTexto: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.primaria,
    },
    linhaSwitch: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      marginBottom: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: cores.bordaSuave,
    },
    rotuloSwitch: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    dicaSwitch: {
      marginTop: 2,
      fontSize: 11,
      color: cores.textoTerciario,
    },
    linhaDupla: {
      flexDirection: "row",
      gap: 12,
    },
    simulador: {
      padding: 16,
      marginBottom: 16,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    simuladorTitulo: {
      fontSize: 13,
      fontWeight: "800",
      color: cores.textoPrimario,
      marginBottom: 8,
    },
    simuladorLinha: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
    },
    simuladorRotulo: {
      fontSize: 13,
      color: cores.textoTerciario,
    },
    simuladorValor: {
      fontSize: 13,
      fontWeight: "700",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    simuladorValorDestaque: {
      fontSize: 14,
      fontWeight: "800",
    },
    simuladorValorAlerta: {
      color: cores.alerta,
    },
    simuladorValorOk: {
      color: cores.sucesso,
    },
    sugestaoCaixa: {
      marginTop: 10,
      padding: 12,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.primariaFundoForte,
      backgroundColor: cores.primariaFundo,
    },
    sugestaoTexto: {
      fontSize: 13,
      color: cores.textoSecundario,
      lineHeight: 19,
    },
    sugestaoDestaque: {
      fontWeight: "800",
      color: cores.primaria,
    },
    avisoCaixa: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginTop: -4,
      marginBottom: 14,
      padding: 12,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.alertaBorda,
      backgroundColor: cores.alertaFundo,
    },
    avisoCaixaPerigo: {
      borderColor: cores.perigoBorda,
      backgroundColor: cores.perigoFundo,
    },
    avisoTexto: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "600",
      color: cores.alerta,
    },
    avisoTextoPerigo: {
      color: cores.perigo,
    },
    linhaCheckbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 12,
    },
    checkboxTexto: {
      flex: 1,
      fontSize: 13,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
  });
}
