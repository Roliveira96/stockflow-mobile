import { Text, TouchableOpacity, View } from "react-native";

import type { ProductCardProps } from "@/types";

import { styles } from "./styles";

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ produto, onExcluir }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.detalhes}>
          Quantidade: {produto.quantidade} · {formatadorPreco.format(produto.preco)}
        </Text>
        <View style={[styles.selo, produto.ativo ? undefined : styles.seloInativo]}>
          <Text style={[styles.seloTexto, produto.ativo ? undefined : styles.seloTextoInativo]}>
            {produto.ativo ? "Ativo" : "Inativo"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.botaoExcluir}
        onPress={() => onExcluir(produto.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoExcluirTexto}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
}
