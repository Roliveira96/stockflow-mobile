import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 4,
    zIndex: 10,
  },
  buscaContainer: {
    position: "relative",
    zIndex: 10,
  },
  sugestoesContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: -12,
    backgroundColor: cores.superficie,
    borderRadius: raios.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    maxHeight: 180,
    overflow: "hidden",
    zIndex: 20,
    elevation: 4,
  },
  sugestaoItem: {
    justifyContent: "center",
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
  },
  sugestaoTexto: {
    fontSize: 14,
    color: cores.textoPrimario,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  chip: {
    justifyContent: "center",
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 14,
    borderRadius: raios.pill,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  chipSelecionado: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
  chipTextoSelecionado: {
    color: cores.textoSobreCor,
  },
});
