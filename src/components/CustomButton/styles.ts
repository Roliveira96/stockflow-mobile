import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: raios.md,
  },
  sombra: {
    ...sombra.botao,
  },
  botao: {
    width: "100%",
    height: ALVO_TOQUE_MINIMO,
    borderRadius: raios.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icone: {
    marginRight: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.textoSobreCor,
  },
});
