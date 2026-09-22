import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios } from "@/constants/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: raios.md,
    backgroundColor: cores.superficie,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.textoPrimario,
    paddingVertical: 4,
  },
  detalhes: {
    marginTop: 2,
    fontSize: 14,
    color: cores.textoSecundario,
  },
  codigoBarras: {
    marginTop: 2,
    fontSize: 12,
    color: cores.textoTerciario,
  },
  descricao: {
    marginTop: 6,
    fontSize: 13,
    color: cores.textoSecundario,
  },
  selos: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selo: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: raios.pill,
    backgroundColor: cores.sucessoFundo,
  },
  seloInativo: {
    backgroundColor: cores.neutroFundo,
  },
  seloTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.sucesso,
  },
  seloTextoInativo: {
    color: cores.textoTerciario,
  },
  seloAlerta: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: raios.pill,
    backgroundColor: cores.alertaFundo,
  },
  seloTextoAlerta: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.alerta,
  },
  acoes: {
    gap: 8,
  },
  botaoVisualizar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 12,
    borderRadius: raios.sm,
    backgroundColor: cores.neutroFundo,
  },
  botaoVisualizarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
  botaoEditar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 12,
    borderRadius: raios.sm,
    backgroundColor: cores.primariaFundo,
  },
  botaoEditarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.primaria,
  },
  botaoExcluir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 12,
    borderRadius: raios.sm,
    backgroundColor: cores.perigoFundo,
  },
  botaoExcluirTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.perigo,
  },
});
