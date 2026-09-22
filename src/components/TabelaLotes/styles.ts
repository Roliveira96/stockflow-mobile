import { StyleSheet } from "react-native";

import { cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  vazio: {
    fontSize: 13,
    color: cores.textoTerciario,
  },
  linha: {
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    padding: 14,
    marginBottom: 10,
    ...sombra.flutuante,
  },
  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  codigo: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  selo: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: raios.pill,
    backgroundColor: cores.sucessoFundo,
  },
  seloTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: cores.sucesso,
  },
  seloVencendo: {
    backgroundColor: cores.alertaFundo,
  },
  seloTextoVencendo: {
    color: cores.alerta,
  },
  seloVencido: {
    backgroundColor: cores.perigoFundo,
  },
  seloTextoVencido: {
    color: cores.perigo,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  campo: {
    minWidth: 90,
  },
  campoRotulo: {
    fontSize: 11,
    color: cores.textoTerciario,
  },
  campoValor: {
    fontSize: 13,
    fontWeight: "600",
    color: cores.textoSecundario,
    marginTop: 2,
  },
});
