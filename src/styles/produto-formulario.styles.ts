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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: cores.textoPrimario,
    marginBottom: 24,
  },
  carregando: {
    marginTop: 40,
  },
});
