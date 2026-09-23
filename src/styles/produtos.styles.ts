import { StyleSheet } from "react-native";

import { raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    cabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      backgroundColor: cores.fundo,
    },
    marca: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 38,
      height: 38,
      borderRadius: raios.sm,
      backgroundColor: cores.botaoPrimario,
      alignItems: "center",
      justifyContent: "center",
      ...sombra.botao,
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
    botaoUsuario: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      height: 44,
      paddingLeft: 6,
      paddingRight: 10,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: raios.pill,
      backgroundColor: cores.botaoPrimario,
      borderWidth: 2,
      borderColor: cores.primariaFundoForte,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarTexto: {
      fontSize: 12,
      fontWeight: "800",
      color: cores.textoSobreCor,
    },
    indicadorOnline: {
      position: "absolute",
      right: -3,
      bottom: -3,
      width: 11,
      height: 11,
      borderRadius: raios.pill,
      borderWidth: 2,
      borderColor: cores.superficie,
      backgroundColor: cores.sucesso,
    },
    carregando: {
      marginTop: 40,
    },
    listaContainer: {
      flex: 1,
    },
    lista: {
      paddingHorizontal: 16,
      paddingTop: 2,
      paddingBottom: 16,
      flexGrow: 1,
    },
    celulaComMenuAberto: {
      zIndex: 100,
      elevation: 100,
    },
    vazio: {
      alignItems: "center",
      paddingTop: 48,
      paddingHorizontal: 24,
      gap: 6,
    },
    vazioIcone: {
      width: 60,
      height: 60,
      borderRadius: raios.pill,
      backgroundColor: cores.neutroFundo,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    vazioTitulo: {
      fontSize: 15,
      fontWeight: "700",
      color: cores.textoPrimario,
    },
    vazioTexto: {
      fontSize: 13,
      textAlign: "center",
      color: cores.textoTerciario,
    },
    carregandoMais: {
      marginVertical: 16,
    },
    contador: {
      textAlign: "center",
      fontSize: 12,
      fontWeight: "500",
      color: cores.textoTerciario,
      paddingVertical: 12,
    },
    rodape: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: cores.borda,
      backgroundColor: cores.fundo,
    },
  });
}
