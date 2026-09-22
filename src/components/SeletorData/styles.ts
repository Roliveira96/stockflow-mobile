import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.textoSecundario,
    marginBottom: 8,
  },
  campo: {
    width: "100%",
    height: ALVO_TOQUE_MINIMO,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    paddingHorizontal: 16,
    backgroundColor: cores.neutroFundo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  campoComErro: {
    borderColor: cores.perigo,
    backgroundColor: cores.superficie,
  },
  campoTexto: {
    fontSize: 16,
    color: cores.textoPrimario,
  },
  campoPlaceholder: {
    fontSize: 16,
    color: cores.textoTerciario,
  },
  erro: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: cores.perigo,
  },
  painel: {
    marginTop: 8,
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    padding: 12,
    ...sombra.flutuante,
  },
  cabecalhoMes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  botaoMes: {
    padding: 6,
  },
  mesTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: cores.textoPrimario,
    textTransform: "capitalize",
  },
  linhaSemana: {
    flexDirection: "row",
  },
  diaSemanaTexto: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: cores.textoTerciario,
    marginBottom: 4,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  celulaDia: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  celulaDiaSelecionada: {
    backgroundColor: cores.primaria,
    borderRadius: raios.pill,
  },
  celulaDiaTexto: {
    fontSize: 14,
    color: cores.textoPrimario,
  },
  celulaDiaTextoSelecionado: {
    color: cores.textoSobreCor,
    fontWeight: "700",
  },
  celulaDiaTextoHoje: {
    color: cores.primaria,
    fontWeight: "800",
  },
});
