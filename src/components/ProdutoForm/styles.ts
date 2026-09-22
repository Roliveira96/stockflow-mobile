import { StyleSheet } from "react-native";

import { cores } from "@/constants/theme";

export const styles = StyleSheet.create({
  linhaSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rotuloSwitch: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
});
