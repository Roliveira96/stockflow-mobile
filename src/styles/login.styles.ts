import { StyleSheet } from "react-native";

import { cores, raios, sombra } from "@/constants/theme";

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
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: raios.lg,
    backgroundColor: cores.superficie,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    ...sombra.cartao,
  },
  logo: {
    width: 60,
    height: 60,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: cores.textoPrimario,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 15,
    color: cores.textoSecundario,
    textAlign: "center",
    marginBottom: 36,
  },
});
