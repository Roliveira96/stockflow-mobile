import { StyleSheet } from "react-native";

import { fonteMono, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
    cartao: {
      alignItems: "stretch",
      gap: 12,
      padding: 16,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.sucessoBorda,
      backgroundColor: cores.superficie,
      ...sombra.cartao,
    },
    flex: {
      flex: 1,
    },
    cabecalho: {
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    icone: {
      fontSize: 20,
    },
    titulo: {
      fontSize: 14,
      fontWeight: "800",
      color: cores.textoPrimario,
    },
    subtitulo: {
      fontSize: 11,
      color: cores.textoTerciario,
    },
    valorCabecalho: {
      fontSize: 15,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.textoPrimario,
    },
    conferencia: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 10,
      borderRadius: raios.sm,
      backgroundColor: cores.superficieAlternativa,
    },
    conferenciaTexto: {
      flex: 1,
      fontSize: 12,
      fontWeight: "700",
      color: cores.alerta,
    },
    conferenciaTextoOk: {
      color: cores.sucesso,
    },
    gerando: {
      alignItems: "center",
      gap: 12,
      paddingVertical: 28,
    },
    gerandoIcone: {
      width: 84,
      height: 84,
      borderRadius: raios.pill,
      backgroundColor: cores.sucessoFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    gerandoTexto: {
      fontSize: 13,
      fontWeight: "700",
      color: cores.sucesso,
    },
    resultado: {
      alignItems: "center",
      gap: 10,
    },
    moldura: {
      padding: 10,
      borderRadius: raios.md,
      backgroundColor: cores.qrFundo,
      borderWidth: 1,
      borderColor: cores.borda,
    },
    valor: {
      fontSize: 22,
      fontWeight: "800",
      fontFamily: fonteMono,
      color: cores.sucesso,
    },
    recebedor: {
      fontSize: 11,
      textAlign: "center",
      color: cores.textoTerciario,
    },
    copiaECola: {
      alignSelf: "stretch",
      gap: 4,
      padding: 10,
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.bordaSuave,
      backgroundColor: cores.superficieAlternativa,
    },
    copiaEColaRotulo: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: cores.textoTerciario,
    },
    copiaEColaTexto: {
      fontSize: 10,
      lineHeight: 15,
      fontFamily: fonteMono,
      color: cores.textoSecundario,
    },
    botaoWhatsapp: {
      alignSelf: "stretch",
    },
    aviso: {
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
      padding: 10,
      borderRadius: raios.sm,
      backgroundColor: cores.alertaFundo,
    },
    avisoTexto: {
      flex: 1,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "600",
      color: cores.alerta,
    },
  });
}
