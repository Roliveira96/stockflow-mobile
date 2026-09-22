import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 8,
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
    marginTop: -14,
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    maxHeight: 180,
    overflow: "hidden",
    zIndex: 20,
    ...sombra.flutuante,
  },
  sugestaoItem: {
    justifyContent: "center",
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
    borderRadius: raios.pill,
    backgroundColor: cores.neutroFundo,
  },
  chipSelecionado: {
    backgroundColor: cores.primaria,
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.textoSecundario,
  },
  chipTextoSelecionado: {
    color: cores.textoSobreCor,
  },
});
