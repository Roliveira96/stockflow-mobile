import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 10,
  },
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  buscaContainer: {
    flex: 1,
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
  selectContainer: {
    width: 142,
    zIndex: 11,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.textoSecundario,
    marginBottom: 8,
  },
  selectCampo: {
    height: ALVO_TOQUE_MINIMO,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    paddingHorizontal: 10,
    backgroundColor: cores.neutroFundo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  selectTexto: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  selectPainel: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    overflow: "hidden",
    zIndex: 21,
    ...sombra.flutuante,
  },
  selectOpcao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
  },
  selectOpcaoSelecionada: {
    backgroundColor: cores.primariaFundo,
  },
  selectOpcaoTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
  selectOpcaoTextoSelecionada: {
    color: cores.primaria,
    fontWeight: "700",
  },
});
