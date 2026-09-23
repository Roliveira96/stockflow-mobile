import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 12,
      marginBottom: 10,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    cardNoCarrinho: {
      borderColor: cores.primariaFundoForte,
    },
    conteudo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    icone: {
      width: 44,
      height: 44,
      borderRadius: raios.sm,
      backgroundColor: cores.neutroFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    iconeTexto: {
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
      marginTop: 3,
    },
    seloCodigo: {
      flexShrink: 1,
      paddingHorizontal: 5,
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
    estoque: {
      fontSize: 11,
      fontWeight: "600",
      color: cores.sucesso,
    },
    estoqueEsgotado: {
      color: cores.perigo,
    },
    detalheExtra: {
      marginTop: 3,
      fontSize: 11,
      fontWeight: "600",
      color: cores.primaria,
    },
    preco: {
      marginTop: 3,
      fontSize: 14,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.primaria,
    },
  });
}
