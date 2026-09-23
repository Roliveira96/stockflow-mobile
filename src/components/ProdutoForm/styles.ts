import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    flex: {
      flex: 1,
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
    botaoLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    botaoLinkTexto: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.primaria,
    },
    campoCategoria: {
      height: ALVO_TOQUE_MINIMO + 2,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.sm,
      paddingHorizontal: 14,
      marginBottom: 14,
      backgroundColor: cores.superficieAlternativa,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    campoCategoriaAberto: {
      borderColor: cores.primaria,
      backgroundColor: cores.superficie,
    },
    campoCategoriaTexto: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: cores.textoPrimario,
    },
    campoCategoriaPlaceholder: {
      fontWeight: "400",
      color: cores.textoTerciario,
    },
    seletorCategoriaPainel: {
      marginTop: -8,
      marginBottom: 14,
      backgroundColor: cores.superficie,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.borda,
      overflow: "hidden",
    },
    seletorCategoriaVazio: {
      padding: 14,
      fontSize: 13,
      color: cores.textoTerciario,
    },
    seletorCategoriaOpcao: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: ALVO_TOQUE_MINIMO,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    seletorCategoriaOpcaoSelecionada: {
      backgroundColor: cores.primariaFundo,
    },
    seletorCategoriaOpcaoTexto: {
      fontSize: 14,
      fontWeight: "500",
      color: cores.textoPrimario,
    },
    seletorCategoriaOpcaoTextoSelecionada: {
      fontWeight: "700",
      color: cores.primaria,
    },
    linhaComBotao: {
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
    linhaDupla: {
      flexDirection: "row",
      gap: 12,
    },
    margemCaixa: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      marginBottom: 14,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.bordaSuave,
      backgroundColor: cores.superficieAlternativa,
    },
    margemRotulo: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.textoSecundario,
    },
    margemDica: {
      marginTop: 2,
      fontSize: 11,
      color: cores.textoTerciario,
    },
    margemValor: {
      fontSize: 16,
      fontWeight: "800",
      fontFamily: fonteMono,
    },
    margemValorSucesso: {
      color: cores.sucesso,
    },
    margemValorAlerta: {
      color: cores.alerta,
    },
    margemValorPerigo: {
      color: cores.perigo,
    },
    dicaLoteInicial: {
      marginTop: -6,
      marginBottom: 14,
      fontSize: 11,
      lineHeight: 16,
      color: cores.textoTerciario,
    },
    linhaSwitch: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingTop: 12,
      paddingBottom: 14,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
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
  });
}
