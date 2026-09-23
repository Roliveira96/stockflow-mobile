import { StyleSheet } from "react-native";

import { fonteMono, raios, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    carregando: {
      marginTop: 40,
    },
    cabecalho: {
      gap: 2,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    subtitulo: {
      fontSize: 11,
      color: cores.textoTerciario,
    },
    conteudo: {
      gap: 14,
      padding: 16,
      paddingBottom: 28,
    },
    rodape: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: cores.borda,
      backgroundColor: cores.fundo,
    },
    flex: {
      flex: 1,
    },
    titulo: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    numero: {
      fontSize: 15,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
    selo: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: raios.pill,
    },
    seloAguardando: {
      backgroundColor: cores.alertaFundo,
    },
    seloPago: {
      backgroundColor: cores.sucessoFundo,
    },
    seloTexto: {
      fontSize: 10,
      fontWeight: "800",
    },
    seloTextoAguardando: {
      color: cores.alerta,
    },
    seloTextoPago: {
      color: cores.sucesso,
    },
    seloCancelado: {
      backgroundColor: cores.perigoFundo,
    },
    seloTextoCancelado: {
      color: cores.perigo,
    },
    textoAjuda: {
      fontSize: 12,
      lineHeight: 17,
      color: cores.textoTerciario,
    },
    opcaoMotivo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      minHeight: 46,
      paddingHorizontal: 12,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },
    opcaoMotivoAtiva: {
      borderColor: cores.perigoBorda,
      backgroundColor: cores.perigoFundo,
    },
    opcaoMotivoTexto: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
      color: cores.textoSecundario,
    },
    opcaoMotivoTextoAtiva: {
      fontWeight: "700",
      color: cores.perigo,
    },
    inputMotivo: {
      minHeight: 80,
      padding: 12,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficieAlternativa,
      fontSize: 13,
      color: cores.textoPrimario,
      textAlignVertical: "top",
      outlineStyle: "solid",
      outlineWidth: 0,
    },
    avisoCancelado: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      padding: 12,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.perigoBorda,
      backgroundColor: cores.perigoFundo,
    },
    avisoCanceladoTitulo: {
      fontSize: 12,
      fontWeight: "800",
      color: cores.perigo,
    },
    avisoCanceladoTexto: {
      marginTop: 2,
      fontSize: 13,
      color: cores.textoPrimario,
    },
    observacao: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      padding: 12,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.alertaBorda,
      backgroundColor: cores.alertaFundo,
    },
    observacaoTitulo: {
      fontSize: 12,
      fontWeight: "800",
      color: cores.alerta,
    },
    observacaoTexto: {
      marginTop: 2,
      fontSize: 13,
      lineHeight: 19,
      color: cores.textoPrimario,
    },
    evento: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    eventoPonto: {
      width: 10,
      height: 10,
      marginTop: 4,
      borderRadius: raios.pill,
      backgroundColor: cores.textoTerciario,
    },
    eventoPontoPerigo: {
      backgroundColor: cores.perigo,
    },
    eventoPontoSucesso: {
      backgroundColor: cores.sucesso,
    },
    eventoTitulo: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    eventoData: {
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    eventoMotivo: {
      marginTop: 2,
      fontSize: 12,
      color: cores.textoSecundario,
    },
    botaoSecundario: {
      flex: 1,
      width: undefined,
    },
    botaoPrincipal: {
      flex: 1.4,
      width: undefined,
    },
    caixaCliente: {
      padding: 12,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.bordaSuave,
      backgroundColor: cores.superficieAlternativa,
    },
    rotuloPequeno: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: cores.textoTerciario,
    },
    clienteNome: {
      marginTop: 2,
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    clienteCpf: {
      marginTop: 1,
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    secao: {
      gap: 8,
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
    secaoDica: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.primaria,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minHeight: 48,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.bordaSuave,
      backgroundColor: cores.superficieAlternativa,
    },
    itemEmbalado: {
      borderColor: cores.sucessoBorda,
      backgroundColor: cores.sucessoFundo,
    },
    itemIcone: {
      fontSize: 15,
    },
    itemNome: {
      fontSize: 13,
      fontWeight: "600",
      color: cores.textoPrimario,
    },
    itemNomeEmbalado: {
      color: cores.textoTerciario,
      textDecorationLine: "line-through",
    },
    itemLotes: {
      marginTop: 2,
      fontSize: 10,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    itemQuantidade: {
      fontSize: 13,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    itemBalcao: {
      borderColor: cores.primariaFundoForte,
      backgroundColor: cores.primariaFundo,
    },
    itemBalcaoNome: {
      color: cores.primaria,
    },
    itemBalcaoPreco: {
      fontSize: 13,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
    caixaBalcao: {
      gap: 8,
      padding: 12,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.primariaFundoForte,
      backgroundColor: cores.primariaFundo,
    },
    caixaBalcaoTitulo: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    opcoesBalcao: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    opcaoBalcao: {
      minHeight: 36,
      justifyContent: "center",
      paddingHorizontal: 10,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.primariaFundoForte,
      backgroundColor: cores.superficie,
    },
    opcaoBalcaoTexto: {
      fontSize: 12,
      fontWeight: "600",
      color: cores.primaria,
    },
    resumo: {
      gap: 6,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
    },
    resumoLinha: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    resumoRotulo: {
      fontSize: 13,
      color: cores.textoTerciario,
    },
    resumoValor: {
      fontSize: 13,
      fontFamily: fonteMono,
      color: cores.textoSecundario,
    },
    resumoDesconto: {
      color: cores.perigo,
    },
    resumoPagamento: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    resumoTotalLinha: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: cores.bordaSuave,
    },
    resumoTotalRotulo: {
      fontSize: 14,
      fontWeight: "800",
      color: cores.textoPrimario,
    },
    resumoTotal: {
      fontSize: 18,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
  });
}
