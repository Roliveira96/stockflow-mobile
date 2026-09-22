import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: cores.textoPrimario,
  },
  botaoSair: {
    width: "auto",
    height: ALVO_TOQUE_MINIMO,
    paddingHorizontal: 14,
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
    color: cores.textoTerciario,
  },
  rodape: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
});
