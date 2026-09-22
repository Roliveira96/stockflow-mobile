import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { cores, gradientes } from "@/constants/theme";
import type { CustomButtonProps } from "@/types";

import { styles } from "./styles";

export function CustomButton({
  titulo,
  onPress,
  carregando,
  desabilitado,
  estiloContainer,
  icone,
  variante = "primaria",
}: CustomButtonProps) {
  const bloqueado = desabilitado || carregando;
  const cor = bloqueado ? gradientes.desabilitado : gradientes[variante];

  return (
    <TouchableOpacity
      style={[styles.wrapper, bloqueado ? undefined : styles.sombra, estiloContainer]}
      onPress={onPress}
      disabled={bloqueado}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
    >
      <LinearGradient
        colors={cor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.botao}
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
      </LinearGradient>
    </TouchableOpacity>
  );
}
