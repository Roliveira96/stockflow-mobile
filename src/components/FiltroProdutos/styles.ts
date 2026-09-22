import { StyleSheet } from "react-native";

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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    maxHeight: 180,
    overflow: "hidden",
    zIndex: 20,
    elevation: 4,
  },
  sugestaoItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  sugestaoTexto: {
    fontSize: 14,
    color: "#102A43",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD2D9",
  },
  chipSelecionado: {
    backgroundColor: "#208AEF",
    borderColor: "#208AEF",
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334E68",
  },
  chipTextoSelecionado: {
    color: "#FFFFFF",
  },
});
