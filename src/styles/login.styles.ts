import { StyleSheet } from "react-native";

import { cores } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    width: 96,
    height: 96,
    alignSelf: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: cores.textoPrimario,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: "center",
    marginBottom: 32,
  },
});
