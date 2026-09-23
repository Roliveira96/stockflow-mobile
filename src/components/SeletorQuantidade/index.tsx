import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { SeletorQuantidadeProps } from "@/types";

import { criarEstilos } from "./styles";

export function SeletorQuantidade({
  quantidade,
  maximo,
  aoAumentar,
  aoDiminuir,
  compacto,
}: SeletorQuantidadeProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const podeDiminuir = quantidade > 0;
  const podeAumentar = maximo === undefined || quantidade < maximo;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.botao,
          compacto ? styles.botaoCompacto : undefined,
          styles.botaoDiminuir,
          podeDiminuir ? undefined : styles.botaoDesabilitado,
        ]}
        onPress={aoDiminuir}
        disabled={!podeDiminuir}
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
        hitSlop={{ top: 6, bottom: 6, left: 4, right: 2 }}
      >
        <Ionicons name="remove" size={16} color={cores.neutroTexto} />
      </TouchableOpacity>

      <Text
        style={[styles.valor, quantidade > 0 ? styles.valorAtivo : undefined]}
        accessibilityLabel={`${quantidade} no carrinho`}
      >
        {quantidade}
      </Text>

      <TouchableOpacity
        style={[
          styles.botao,
          compacto ? styles.botaoCompacto : undefined,
          styles.botaoAumentar,
          podeAumentar ? undefined : styles.botaoDesabilitado,
        ]}
        onPress={aoAumentar}
        disabled={!podeAumentar}
        accessibilityRole="button"
        accessibilityLabel={podeAumentar ? "Aumentar quantidade" : "Limite do estoque atingido"}
        hitSlop={{ top: 6, bottom: 6, left: 2, right: 4 }}
      >
        <Ionicons name="add" size={16} color={cores.textoSobreCor} />
      </TouchableOpacity>
    </View>
  );
}
