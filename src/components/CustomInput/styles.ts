import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.textoSecundario,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: ALVO_TOQUE_MINIMO,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    paddingHorizontal: 16,
    fontSize: 16,
    color: cores.textoPrimario,
    backgroundColor: cores.neutroFundo,
  },
  inputFocado: {
    borderColor: cores.primaria,
    backgroundColor: cores.superficie,
  },
  inputComErro: {
    borderColor: cores.perigo,
    backgroundColor: cores.superficie,
  },
  erro: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: cores.perigo,
  },
});
