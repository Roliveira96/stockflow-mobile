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
      <TouchableOpacity
        onPress={() => onVisualizar(produto.id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${produto.nome}`}
      >
        <View style={styles.linhaTopo}>
          <View style={styles.textos}>
            <Text style={styles.nome} numberOfLines={1}>
              {produto.nome}
            </Text>
            {produto.descricao ? (
              <Text style={styles.descricao} numberOfLines={1}>
                {produto.descricao}
              </Text>
            ) : null}
          </View>
          <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
        </View>

        <View style={styles.linhaDetalhes}>
          <View style={styles.detalheItem}>
            <Ionicons name="cube-outline" size={14} color={cores.textoTerciario} />
            <Text style={styles.detalheTexto}>{produto.quantidade} un.</Text>
          </View>
          <View style={styles.detalheItem}>
            <Ionicons name="barcode-outline" size={14} color={cores.textoTerciario} />
            <Text style={styles.detalheTexto}>{produto.codigoBarras}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.rodape}>
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

        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={() => onVisualizar(produto.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Visualizar ${produto.nome}`}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="eye-outline" size={18} color={cores.textoSecundario} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoAcaoPrimaria]}
            onPress={() => onEditar(produto.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${produto.nome}`}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="create-outline" size={18} color={cores.primaria} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoAcaoPerigo]}
            onPress={() => onExcluir(produto.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${produto.nome}`}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="trash-outline" size={18} color={cores.perigo} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
