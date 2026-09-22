import { Text, TouchableOpacity, View } from "react-native";

import type { ProductCardProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

import { styles } from "./styles";

export function ProductCard({ produto, onExcluir, onEditar, onVisualizar }: ProductCardProps) {
  const ultimasUnidades = produto.quantidade > 0 && produto.quantidade < 5;

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <TouchableOpacity onPress={() => onVisualizar(produto.id)} activeOpacity={0.7}>
          <Text style={styles.nome}>{produto.nome}</Text>
        </TouchableOpacity>
        <Text style={styles.detalhes}>
          Quantidade: {produto.quantidade} · {formatarMoeda(produto.preco)}
        </Text>
        <Text style={styles.codigoBarras}>Código: {produto.codigoBarras}</Text>
        {produto.descricao ? <Text style={styles.descricao}>{produto.descricao}</Text> : null}

        <View style={styles.selos}>
          <View style={[styles.selo, produto.ativo ? undefined : styles.seloInativo]}>
            <Text style={[styles.seloTexto, produto.ativo ? undefined : styles.seloTextoInativo]}>
              {produto.ativo ? "Ativo" : "Inativo"}
            </Text>
          </View>
          {ultimasUnidades ? (
            <View style={styles.seloAlerta}>
              <Text style={styles.seloTextoAlerta}>Últimas unidades</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoVisualizar}
          onPress={() => onVisualizar(produto.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoVisualizarTexto}>Visualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => onEditar(produto.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => onExcluir(produto.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoExcluirTexto}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
