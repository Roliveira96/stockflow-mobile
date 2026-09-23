import { StyleSheet } from "react-native";

import { fonteMono, raios, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    seloSeguro: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    seloSeguroTexto: {
      fontSize: 13,
      fontWeight: "800",
      color: cores.sucesso,
    },
    cabecalho: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    icone: {
      width: 56,
      height: 56,
      borderRadius: raios.md,
      backgroundColor: cores.primariaFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    iconeTexto: {
      fontSize: 28,
    },
    categoria: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: cores.primaria,
    },
    nome: {
      marginTop: 2,
      fontSize: 16,
      fontWeight: "800",
      color: cores.textoPrimario,
    },
    codigos: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
    },
    codigoBarras: {
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    seloCodigo: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 6,
      backgroundColor: cores.neutroFundo,
    },
    seloCodigoTexto: {
      fontSize: 10,
      fontWeight: "700",
      fontFamily: fonteMono,
      color: cores.textoSecundario,
    },
    metricas: {
      flexDirection: "row",
      gap: 10,
    },
    metrica: {
      flex: 1,
      padding: 12,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficieAlternativa,
    },
    metricaPreco: {
      borderColor: cores.primariaFundoForte,
      backgroundColor: cores.primariaFundo,
    },
    metricaRotulo: {
      fontSize: 10,
      fontWeight: "600",
      color: cores.textoTerciario,
    },
    metricaRotuloPreco: {
      fontSize: 10,
      fontWeight: "600",
      color: cores.primaria,
    },
    metricaValor: {
      marginTop: 2,
      fontSize: 18,
      fontWeight: "800",
      fontFamily: fonteMono,
    },
    metricaValorPreco: {
      marginTop: 2,
      fontSize: 18,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
    valorSucesso: {
      color: cores.sucesso,
    },
    valorPerigo: {
      color: cores.perigo,
    },
    avisoSemEstoque: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      padding: 10,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.alertaBorda,
      backgroundColor: cores.alertaFundo,
    },
    avisoSemEstoqueTexto: {
      flex: 1,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: "600",
      color: cores.alerta,
    },
    rotuloDescricao: {
      fontSize: 12,
      fontWeight: "700",
      color: cores.textoSecundario,
      marginBottom: 6,
    },
    descricaoCaixa: {
      padding: 12,
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
    botaoSecundario: {
      flex: 1,
      width: undefined,
    },
    botaoPrincipal: {
      flex: 1.8,
      width: undefined,
    },
  });
}
