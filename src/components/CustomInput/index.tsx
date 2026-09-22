import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { cores } from "@/constants/theme";
import type { CustomInputProps } from "@/types";

import { styles } from "./styles";

export function CustomInput({
  label,
  erro,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...rest
}: CustomInputProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focado ? styles.inputFocado : undefined,
          erro ? styles.inputComErro : undefined,
        ]}
        placeholderTextColor={cores.textoTerciario}
        accessibilityLabel={accessibilityLabel ?? label}
        onFocus={(evento) => {
          setFocado(true);
          onFocus?.(evento);
        }}
        onBlur={(evento) => {
          setFocado(false);
          onBlur?.(evento);
        }}
        {...rest}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}
