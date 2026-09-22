import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E4E7EB",
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
    color: "#102A43",
  },
  detalhes: {
    marginTop: 4,
    fontSize: 14,
    color: "#627D98",
  },
  codigoBarras: {
    marginTop: 2,
    fontSize: 12,
    color: "#9AA5B1",
  },
  descricao: {
    marginTop: 6,
    fontSize: 13,
    color: "#334E68",
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
    borderRadius: 999,
    backgroundColor: "#D3F9D8",
  },
  seloInativo: {
    backgroundColor: "#F0F4F8",
  },
  seloTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F9E44",
  },
  seloTextoInativo: {
    color: "#829AB1",
  },
  seloAlerta: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#FFF3BF",
  },
  seloTextoAlerta: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B08900",
  },
  acoes: {
    gap: 8,
  },
  botaoVisualizar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0F4F8",
  },
  botaoVisualizarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334E68",
  },
  botaoEditar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
  },
  botaoEditarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#208AEF",
  },
  botaoExcluir: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF1F0",
  },
  botaoExcluirTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E12D39",
  },
});
