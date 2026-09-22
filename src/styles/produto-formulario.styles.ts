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
    fontSize: 24,
    fontWeight: "700",
    color: cores.textoPrimario,
    marginBottom: 20,
  },
  carregando: {
    marginTop: 40,
  },
});
