import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    flex: {
      flex: 1,
    },
    cabecalho: {
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      backgroundColor: cores.fundo,
    },
    linhaCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    operador: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 38,
      height: 38,
      borderRadius: raios.sm,
      backgroundColor: cores.botaoSucesso,
      alignItems: "center",
      justifyContent: "center",
      ...sombra.botaoSucesso,
    },
    titulo: {
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.4,
      color: cores.textoPrimario,
    },
    subtitulo: {
      fontSize: 11,
      fontWeight: "500",
      color: cores.textoTerciario,
    },
    botaoMenu: {
      width: 44,
      height: 44,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      alignItems: "center",
      justifyContent: "center",
      ...sombra.cartao,
    },
    metricas: {
      flexDirection: "row",
      gap: 10,
    },
    metrica: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: raios.md,
      borderWidth: 1,
    },
    metricaAlerta: {
      borderColor: cores.alertaBorda,
      backgroundColor: cores.alertaFundo,
    },
    metricaSucesso: {
      borderColor: cores.sucessoBorda,
      backgroundColor: cores.sucessoFundo,
    },
    metricaRotulo: {
      fontSize: 11,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    metricaValor: {
      marginTop: 2,
      fontSize: 18,
      fontWeight: "800",
      fontFamily: fonteMono,
    },
    metricaValorAlerta: {
      color: cores.alerta,
    },
    metricaValorSucesso: {
      color: cores.sucesso,
    },
    campoBusca: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      height: 44,
      paddingLeft: 12,
      paddingRight: 4,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },
    inputBusca: {
      flex: 1,
      height: "100%",
      fontSize: 14,
      color: cores.textoPrimario,
      outlineStyle: "solid",
      outlineWidth: 0,
    },
    botaoLimpar: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    filtros: {
      flexDirection: "row",
      gap: 4,
      padding: 4,
      borderRadius: raios.md,
      backgroundColor: cores.neutroFundoForte,
    },
    filtro: {
      flex: 1,
      height: 36,
      borderRadius: raios.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    filtroAtivo: {
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    filtroTexto: {
      fontSize: 12,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    filtroTextoAtivo: {
      fontWeight: "800",
      color: cores.primaria,
    },
    lista: {
      flexGrow: 1,
      padding: 16,
    },
    vazio: {
      alignItems: "center",
      gap: 6,
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    vazioTitulo: {
      fontSize: 14,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    vazioTexto: {
      fontSize: 12,
      textAlign: "center",
      color: cores.textoTerciario,
    },
  });
}
