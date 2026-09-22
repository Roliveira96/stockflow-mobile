import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import type { CustomButtonProps } from "@/types";

import { styles } from "./styles";

export function CustomButton({ titulo, onPress, carregando, desabilitado }: CustomButtonProps) {
  const bloqueado = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[styles.botao, bloqueado ? styles.botaoDesabilitado : undefined]}
      onPress={onPress}
      disabled={bloqueado}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}
