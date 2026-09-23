import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { BarraTopoProps } from "@/types";

import { criarEstilos } from "./styles";

export function BarraTopo({ rotuloVoltar, aoVoltar, direita }: BarraTopoProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={styles.barra}>
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel={rotuloVoltar}
      >
        <Ionicons name="chevron-back" size={18} color={cores.textoSecundario} />
        <Text style={styles.textoVoltar}>{rotuloVoltar}</Text>
      </TouchableOpacity>
      {direita}
    </View>
  );
}
