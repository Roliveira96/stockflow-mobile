import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoSecundario,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: ALVO_TOQUE_MINIMO,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    paddingHorizontal: 12,
    fontSize: 16,
    color: cores.textoPrimario,
    backgroundColor: cores.superficie,
  },
  inputFocado: {
    borderColor: cores.primaria,
    borderWidth: 2,
  },
  inputComErro: {
    borderColor: cores.perigo,
  },
  erro: {
    marginTop: 4,
    fontSize: 12,
    color: cores.perigo,
  },
});
