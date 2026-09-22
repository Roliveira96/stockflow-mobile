import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";

import { cores } from "@/constants/theme";
import type { ProductCardProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

import { styles } from "./styles";

export function ProductCard({ produto, onExcluir, onEditar, onVisualizar }: ProductCardProps) {
  const ultimasUnidades = produto.quantidade > 0 && produto.quantidade < 5;

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <TouchableOpacity
          onPress={() => onVisualizar(produto.id)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalhes de ${produto.nome}`}
        >
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
          accessibilityRole="button"
          accessibilityLabel={`Visualizar ${produto.nome}`}
        >
          <Ionicons name="eye-outline" size={16} color={cores.textoSecundario} />
          <Text style={styles.botaoVisualizarTexto}>Visualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => onEditar(produto.id)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${produto.nome}`}
        >
          <Ionicons name="create-outline" size={16} color={cores.primaria} />
          <Text style={styles.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => onExcluir(produto.id)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${produto.nome}`}
        >
          <Ionicons name="trash-outline" size={16} color={cores.perigo} />
          <Text style={styles.botaoExcluirTexto}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
