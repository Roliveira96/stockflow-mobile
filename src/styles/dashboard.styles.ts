import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    conteudo: {
      paddingBottom: 40,
    },

    // Tela de Intro / Splash Animada
    introContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: cores.fundo,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
      elevation: 999,
      padding: 24,
    },
    introCartao: {
      alignItems: "center",
      maxWidth: 380,
      width: "100%",
    },
    introIconeContainer: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: cores.primariaFundo,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: cores.primariaFundoForte,
      ...sombra.cartao,
    },
    introTitulo: {
      fontSize: 26,
      fontWeight: "800",
      color: cores.textoPrimario,
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    introSubtitulo: {
      fontSize: 15,
      fontWeight: "500",
      color: cores.textoSecundario,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 12,
    },
    introBarraContainer: {
      width: 180,
      height: 4,
      backgroundColor: cores.neutroFundoForte,
      borderRadius: 2,
      marginTop: 28,
      overflow: "hidden",
    },
    introBarraProgresso: {
      height: "100%",
      backgroundColor: cores.primaria,
      borderRadius: 2,
    },
    introBotaoPular: {
      marginTop: 32,
      paddingVertical: 10,
      paddingHorizontal: 16,
      minHeight: ALVO_TOQUE_MINIMO,
      justifyContent: "center",
      alignItems: "center",
    },
    introTextoPular: {
      fontSize: 13,
      fontWeight: "600",
      color: cores.textoTerciario,
    },

    // Cabeçalho
    cabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 14,
      backgroundColor: cores.superficie,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
    },
    cabecalhoInfo: {
      flex: 1,
    },
    cabecalhoData: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.primaria,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    cabecalhoTitulo: {
      fontSize: 20,
      fontWeight: "800",
      color: cores.textoPrimario,
      letterSpacing: -0.4,
    },
    cabecalhoAcoes: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    botaoCabecalho: {
      width: ALVO_TOQUE_MINIMO,
      height: ALVO_TOQUE_MINIMO,
      borderRadius: raios.md,
      backgroundColor: cores.superficieAlternativa,
      borderWidth: 1,
      borderColor: cores.borda,
      justifyContent: "center",
      alignItems: "center",
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: cores.primaria,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarTexto: {
      fontSize: 13,
      fontWeight: "800",
      color: cores.textoSobreCor,
    },

    // Hero Card de Vendas do Dia
    heroCard: {
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
      padding: 20,
      borderRadius: raios.lg,
      backgroundColor: cores.primaria,
      ...sombra.cartao,
    },
    heroLinhaTopo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    heroRotulo: {
      fontSize: 13,
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.85)",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    heroIcone: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroValor: {
      fontSize: 32,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: -0.8,
      marginBottom: 12,
    },
    heroLinhaRodape: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.2)",
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: raios.sm,
      gap: 4,
    },
    heroBadgeTexto: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    heroSubtexto: {
      fontSize: 12,
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.85)",
    },

    // Grid de Métricas Secundárias
    gridMetricas: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 12,
      gap: 8,
      marginBottom: 16,
    },
    cartaoMetrica: {
      width: "48%",
      padding: 14,
      borderRadius: raios.md,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      ...sombra.cartao,
    },
    cartaoMetricaTopo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    cartaoMetricaRotulo: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.textoTerciario,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    cartaoMetricaIcone: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    iconeFundoPrimaria: {
      backgroundColor: cores.primariaFundo,
    },
    iconeFundoSucesso: {
      backgroundColor: cores.sucessoFundo,
    },
    iconeFundoNeutro: {
      backgroundColor: cores.neutroFundo,
    },
    iconeFundoAlerta: {
      backgroundColor: cores.alertaFundo,
    },
    iconeFundoPerigo: {
      backgroundColor: cores.perigoFundo,
    },
    cartaoMetricaValor: {
      fontSize: 17,
      fontWeight: "800",
      color: cores.textoPrimario,
      letterSpacing: -0.3,
      marginBottom: 2,
    },
    cartaoMetricaSubtexto: {
      fontSize: 11,
      fontWeight: "500",
      color: cores.textoTerciario,
    },

    // Atalhos Rápidos
    atalhosContainer: {
      flexDirection: "row",
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    botaoAtalho: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 8,
      borderRadius: raios.md,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      minHeight: ALVO_TOQUE_MINIMO,
      ...sombra.cartao,
    },
    botaoAtalhoIcone: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    botaoAtalhoTexto: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.textoPrimario,
      textAlign: "center",
    },

    // Seção Geral em Card
    secao: {
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 16,
      borderRadius: raios.lg,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      ...sombra.cartao,
    },
    secaoCabecalho: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    secaoTitulo: {
      fontSize: 15,
      fontWeight: "800",
      color: cores.textoPrimario,
      letterSpacing: -0.2,
    },
    linkVerTodos: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.primaria,
    },

    // Alertas Rápidos de Estoque / Lote
    alertaItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: raios.sm,
      backgroundColor: cores.alertaFundo,
      borderWidth: 1,
      borderColor: cores.alertaBorda,
      marginBottom: 10,
    },
    alertaItemCritico: {
      backgroundColor: cores.perigoFundo,
      borderColor: cores.perigoBorda,
    },
    alertaConteudo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    alertaTextoTitulo: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    alertaTextoSub: {
      fontSize: 11,
      fontWeight: "500",
      color: cores.textoSecundario,
    },
    alertaBotao: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: raios.sm,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
    },
    alertaBotaoTexto: {
      fontSize: 11,
      fontWeight: "700",
      color: cores.textoPrimario,
    },

    // Formas de Pagamento
    linhaForma: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    linhaFormaEsquerda: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    linhaFormaIcone: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: cores.superficieAlternativa,
      justifyContent: "center",
      alignItems: "center",
    },
    linhaFormaNome: {
      fontSize: 13,
      fontWeight: "600",
      color: cores.textoPrimario,
    },
    linhaFormaQtd: {
      fontSize: 11,
      fontWeight: "500",
      color: cores.textoTerciario,
    },
    linhaFormaDireita: {
      alignItems: "flex-end",
    },
    linhaFormaValor: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
      marginBottom: 4,
    },
    barraProgressoContainer: {
      height: 5,
      backgroundColor: cores.neutroFundoForte,
      borderRadius: 3,
      width: 70,
      overflow: "hidden",
    },
    barraProgressoPreenchida: {
      height: "100%",
      backgroundColor: cores.primaria,
      borderRadius: 3,
    },

    // Pedidos Recentes
    itemPedido: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    itemPedidoEsquerda: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    itemPedidoStatusIcone: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    itemPedidoNumero: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    itemPedidoCliente: {
      fontSize: 11,
      fontWeight: "500",
      color: cores.textoSecundario,
    },
    itemPedidoDireita: {
      alignItems: "flex-end",
    },
    itemPedidoValor: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    itemPedidoHora: {
      fontSize: 11,
      fontWeight: "500",
      color: cores.textoTerciario,
    },
    vazioContainer: {
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    vazioTitulo: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.textoSecundario,
    },
    vazioSubtexto: {
      fontSize: 12,
      fontWeight: "500",
      color: cores.textoTerciario,
      textAlign: "center",
    },
  });
}
