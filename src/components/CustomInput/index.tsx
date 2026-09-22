import { Text, TextInput, View } from "react-native";

import type { CustomInputProps } from "@/types";

import { styles } from "./styles";

export function CustomInput({ label, erro, style, ...rest }: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erro ? styles.inputComErro : undefined]}
        placeholderTextColor="#9AA5B1"
        {...rest}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}
