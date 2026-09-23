import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { CustomInputProps } from "@/types";

import { criarEstilos } from "./styles";

export function CustomInput({
  label,
  erro,
  obrigatorio,
  contador,
  monoespacado,
  multiline,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...rest
}: CustomInputProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.linhaLabel}>
        <Text style={styles.label}>
          {label}
          {obrigatorio ? <Text style={styles.obrigatorio}> *</Text> : null}
        </Text>
        {contador ? <Text style={styles.contador}>{contador}</Text> : null}
      </View>
      <TextInput
        style={[
          styles.input,
          multiline ? styles.inputMultilinha : undefined,
          monoespacado ? styles.inputMono : undefined,
          focado ? styles.inputFocado : undefined,
          erro ? styles.inputComErro : undefined,
          style,
        ]}
        placeholderTextColor={cores.textoTerciario}
        accessibilityLabel={accessibilityLabel ?? label}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
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
