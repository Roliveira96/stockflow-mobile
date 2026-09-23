import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    card: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      paddingVertical: 12,
      paddingLeft: 12,
      paddingRight: 4,
      marginBottom: 10,
      ...sombra.cartao,
    },
    cardInativo: {
      backgroundColor: cores.superficieAlternativa,
    },
    conteudo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconeCategoria: {
      width: 44,
      height: 44,
      borderRadius: raios.sm,
      backgroundColor: cores.neutroFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    iconeCategoriaTexto: {
      fontSize: 20,
    },
    textos: {
      flex: 1,
      minWidth: 0,
    },
    nome: {
      fontSize: 14,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    linhaDetalhes: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 5,
    },
    selo: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
    },
    seloNormal: {
      backgroundColor: cores.sucessoFundo,
      borderColor: cores.sucessoBorda,
    },
    seloBaixo: {
      backgroundColor: cores.alertaFundo,
      borderColor: cores.alertaBorda,
    },
    seloCritico: {
      backgroundColor: cores.perigoFundo,
      borderColor: cores.perigoBorda,
    },
    seloInativo: {
      backgroundColor: cores.neutroFundo,
      borderColor: cores.borda,
    },
    seloVencimento: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: cores.alertaFundo,
      borderColor: cores.alertaBorda,
    },
    seloVencido: {
      backgroundColor: cores.perigoFundo,
      borderColor: cores.perigoBorda,
    },
    seloTexto: {
      fontSize: 11,
      fontWeight: "700",
    },
    seloTextoNormal: {
      color: cores.sucesso,
    },
    seloTextoBaixo: {
      color: cores.alerta,
    },
    seloTextoCritico: {
      color: cores.perigo,
    },
    seloTextoInativo: {
      color: cores.textoTerciario,
    },
    separador: {
      fontSize: 11,
      color: cores.textoTerciario,
    },
    codigo: {
      flexShrink: 1,
      fontSize: 11,
      fontFamily: fonteMono,
      color: cores.textoTerciario,
    },
    preco: {
      fontSize: 14,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
    menuContainer: {
      position: "relative",
    },
    botaoMenu: {
      width: 32,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: raios.sm,
    },
    botaoMenuAtivo: {
      backgroundColor: cores.neutroFundo,
    },
    menuPainel: {
      position: "absolute",
      top: 42,
      right: 4,
      width: 176,
      backgroundColor: cores.superficie,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      overflow: "hidden",
      zIndex: 30,
      ...sombra.flutuante,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      height: 44,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: cores.bordaSuave,
    },
    menuItemUltimo: {
      borderBottomWidth: 0,
    },
    menuItemTexto: {
      fontSize: 14,
      fontWeight: "600",
      color: cores.textoSecundario,
    },
    menuItemTextoPrimaria: {
      color: cores.primaria,
    },
    menuItemTextoPerigo: {
      color: cores.perigo,
    },
  });
}
