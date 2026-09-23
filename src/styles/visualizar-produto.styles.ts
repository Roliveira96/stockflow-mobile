import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    carregando: {
      marginTop: 40,
    },
    seloStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: raios.pill,
      backgroundColor: cores.sucessoFundo,
    },
    seloStatusInativo: {
      backgroundColor: cores.neutroFundoForte,
    },
    pontoStatus: {
      width: 6,
      height: 6,
      borderRadius: raios.pill,
      backgroundColor: cores.sucesso,
    },
    pontoStatusInativo: {
      backgroundColor: cores.textoTerciario,
    },
    seloStatusTexto: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.sucesso,
    },
    seloStatusTextoInativo: {
      color: cores.textoSecundario,
    },
    cabecalho: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 12,
      gap: 6,
      backgroundColor: cores.fundo,
    },
    nome: {
      fontSize: 21,
      fontWeight: "800",
      letterSpacing: -0.4,
      color: cores.textoPrimario,
    },
    linhaIdentificacao: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    seloCategoria: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: cores.primariaFundo,
    },
    seloCategoriaTexto: {
      fontSize: 12,
      fontWeight: "600",
      color: cores.primaria,
    },
    codigoCabecalho: {
      fontSize: 12,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    abas: {
      flexDirection: "row",
      gap: 4,
      marginTop: 10,
      padding: 4,
      borderRadius: raios.md,
      backgroundColor: cores.neutroFundoForte,
    },
    aba: {
      flex: 1,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: raios.sm,
    },
    abaAtiva: {
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    abaTexto: {
      fontSize: 12,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    abaTextoAtiva: {
      fontWeight: "700",
      color: cores.primaria,
    },
    scroll: {
      flex: 1,
    },
    conteudo: {
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 24,
      gap: 14,
    },
    metricas: {
      flexDirection: "row",
      gap: 12,
    },
    metrica: {
      flex: 1,
      padding: 14,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    metricaRotulo: {
      fontSize: 11,
      fontWeight: "600",
      color: cores.textoTerciario,
      marginBottom: 2,
    },
    metricaValor: {
      fontSize: 19,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    metricaValorPrimaria: {
      color: cores.primaria,
    },
    metricaNota: {
      marginTop: 4,
      fontSize: 11,
      fontWeight: "600",
      color: cores.textoTerciario,
    },
    metricaNotaSucesso: {
      color: cores.sucesso,
    },
    metricaNotaAlerta: {
      color: cores.alerta,
    },
    metricaNotaPerigo: {
      color: cores.perigo,
    },
    flex: {
      flex: 1,
    },
    cartaoValidade: {
      padding: 14,
      gap: 10,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    cartaoValidadeAlerta: {
      borderColor: cores.alertaBorda,
      backgroundColor: cores.alertaFundo,
    },
    cartaoValidadePerigo: {
      borderColor: cores.perigoBorda,
      backgroundColor: cores.perigoFundo,
    },
    validadeCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    validadeTitulo: {
      fontSize: 13,
      fontWeight: "800",
      color: cores.textoPrimario,
    },
    validadeResumo: {
      flexDirection: "row",
      gap: 16,
    },
    validadeNumero: {
      flex: 1,
    },
    validadeNumeroValor: {
      fontSize: 18,
      fontWeight: "800",
      fontFamily: fonteMono,
    },
    validadeNumeroAlerta: {
      color: cores.alerta,
    },
    validadeNumeroPerigo: {
      color: cores.perigo,
    },
    validadeNumeroRotulo: {
      fontSize: 11,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    loteAtencao: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: raios.sm,
      backgroundColor: cores.superficie,
    },
    loteAtencaoCodigo: {
      fontSize: 13,
      fontWeight: "700",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    loteAtencaoPrazo: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: "600",
    },
    loteAtencaoSaldo: {
      fontSize: 13,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    validadeVazio: {
      fontSize: 12,
      color: cores.textoSecundario,
    },
    cartao: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    linha: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    linhaSemBorda: {
      borderBottomWidth: 0,
    },
    linhaRotulo: {
      fontSize: 13,
      fontWeight: "500",
      color: cores.textoTerciario,
    },
    linhaValor: {
      flexShrink: 1,
      textAlign: "right",
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    linhaValorSuave: {
      fontSize: 12,
      color: cores.textoSecundario,
    },
    linhaValorMono: {
      fontFamily: fonteMono,
    },
    descricao: {
      paddingTop: 6,
      paddingBottom: 10,
    },
    descricaoRotulo: {
      fontSize: 12,
      fontWeight: "600",
      color: cores.textoTerciario,
      marginBottom: 6,
    },
    descricaoCaixa: {
      padding: 14,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.bordaSuave,
      backgroundColor: cores.superficieAlternativa,
    },
    descricaoTexto: {
      fontSize: 13,
      lineHeight: 20,
      color: cores.textoSecundario,
    },
    secaoCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    secaoTitulo: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoSecundario,
    },
    botaoLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      height: 36,
      paddingHorizontal: 4,
    },
    botaoLinkTexto: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.primaria,
    },
    vazio: {
      fontSize: 13,
      color: cores.textoTerciario,
    },
    timeline: {
      marginLeft: 8,
      paddingLeft: 22,
      paddingVertical: 4,
      gap: 20,
      borderLeftWidth: 2,
      borderLeftColor: cores.borda,
    },
    evento: {
      position: "relative",
      gap: 3,
    },
    eventoPonto: {
      position: "absolute",
      left: -31,
      top: 0,
      width: 16,
      height: 16,
      borderRadius: raios.pill,
      borderWidth: 3,
      borderColor: cores.fundo,
      backgroundColor: cores.textoTerciario,
    },
    eventoPontoRecente: {
      backgroundColor: cores.botaoPrimario,
    },
    eventoData: {
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    eventoTexto: {
      fontSize: 13,
      fontWeight: "500",
      lineHeight: 20,
      color: cores.textoSecundario,
    },
    eventoDe: {
      color: cores.textoTerciario,
      textDecorationLine: "line-through",
    },
    eventoPara: {
      fontWeight: "700",
      color: cores.primaria,
    },
    acoes: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: cores.borda,
      backgroundColor: cores.fundo,
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
