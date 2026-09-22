import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#102A43",
  },
  botaoSair: {
    width: 96,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#334E68",
  },
  carregando: {
    marginTop: 40,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  vazio: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#829AB1",
  },
  rodape: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
});
