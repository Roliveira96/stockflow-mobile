import { StyleSheet } from "react-native";

import { raios, sombra, type Cores } from "@/constants/theme";

export function criarEstilos(cores: Cores) {
  return StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  cartao: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 22,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    ...sombra.cartao,
  },
  rodape: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 12,
    color: cores.textoTerciario,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...sombra.cartao,
  },
  logo: {
    width: 48,
    height: 48,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: cores.textoPrimario,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoTerciario,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 28,
  },
  });
}
