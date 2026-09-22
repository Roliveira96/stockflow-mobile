import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios } from "@/constants/theme";

export const styles = StyleSheet.create({
  botao: {
    width: "100%",
    height: ALVO_TOQUE_MINIMO,
    borderRadius: raios.sm,
    backgroundColor: cores.primaria,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoDesabilitado: {
    backgroundColor: cores.desabilitado,
    opacity: 0.7,
  },
  icone: {
    marginRight: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.textoSobreCor,
  },
});
