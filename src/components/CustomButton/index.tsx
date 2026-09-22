import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { cores } from "@/constants/theme";
import type { CustomButtonProps } from "@/types";

import { styles } from "./styles";

export function CustomButton({
  titulo,
  onPress,
  carregando,
  desabilitado,
  estiloContainer,
  icone,
}: CustomButtonProps) {
  const bloqueado = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[styles.botao, bloqueado ? styles.botaoDesabilitado : undefined, estiloContainer]}
      onPress={onPress}
      disabled={bloqueado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
    >
      {carregando ? (
        <ActivityIndicator color={cores.textoSobreCor} />
      ) : (
        <>
          {icone ? (
            <Ionicons name={icone} size={18} color={cores.textoSobreCor} style={styles.icone} />
          ) : null}
          <Text style={styles.texto}>{titulo}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
