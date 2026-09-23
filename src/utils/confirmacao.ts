import { Alert, Platform } from "react-native";

import type { ConfirmacaoAcao } from "@/types";

export function confirmarAcao({ titulo, mensagem, textoConfirmar }: ConfirmacaoAcao): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: textoConfirmar, style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
