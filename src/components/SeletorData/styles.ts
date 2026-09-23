import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.textoSecundario,
    marginBottom: 6,
  },
  campo: {
    width: "100%",
    height: ALVO_TOQUE_MINIMO + 2,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    paddingHorizontal: 14,
    backgroundColor: cores.superficieAlternativa,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  campoComErro: {
    borderColor: cores.perigo,
    backgroundColor: cores.superficie,
  },
  campoTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoPrimario,
  },
  campoPlaceholder: {
    fontSize: 14,
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
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra.cartao,
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
    backgroundColor: cores.botaoPrimario,
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
}
