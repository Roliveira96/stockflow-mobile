import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";

import { cores } from "@/constants/theme";
import type { ProductCardProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

import { styles } from "./styles";

export function ProductCard({
  produto,
  onExcluir,
  onEditar,
  onVisualizar,
  menuAberto,
  aoAlternarMenu,
}: ProductCardProps) {
  const ultimasUnidades = produto.quantidade > 0 && produto.quantidade < 5;

  function handleAcao(acao: () => void) {
    aoAlternarMenu();
    acao();
  }

  return (
    <View style={[styles.card, menuAberto ? styles.cardMenuAberto : undefined]}>
      <TouchableOpacity
        style={styles.conteudo}
        onPress={() => onVisualizar(produto.id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${produto.nome}`}
      >
        <View style={styles.linhaTopo}>
          <Text style={styles.nome} numberOfLines={1}>
            {produto.nome}
          </Text>
          <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
        </View>

        <View style={styles.linhaDetalhes}>
          <Text style={styles.detalheTexto} numberOfLines={1}>
            {produto.quantidade} un. · {produto.codigoBarras}
          </Text>

          <View style={styles.selos}>
            {!produto.ativo ? (
              <View style={[styles.selo, styles.seloInativo]}>
                <Text style={[styles.seloTexto, styles.seloTextoInativo]}>Inativo</Text>
              </View>
            ) : null}
            {ultimasUnidades ? (
              <View style={styles.seloAlerta}>
                <Text style={styles.seloTextoAlerta}>Últimas unidades</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.botaoMenu}
          onPress={aoAlternarMenu}
          accessibilityRole="button"
          accessibilityLabel={`Mais ações para ${produto.nome}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={cores.textoTerciario} />
        </TouchableOpacity>

        {menuAberto ? (
          <View style={styles.menuPainel}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAcao(() => onVisualizar(produto.id))}
              accessibilityRole="button"
              accessibilityLabel={`Visualizar ${produto.nome}`}
            >
              <Ionicons name="eye-outline" size={18} color={cores.textoSecundario} />
              <Text style={styles.menuItemTexto}>Visualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAcao(() => onEditar(produto.id))}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${produto.nome}`}
            >
              <Ionicons name="create-outline" size={18} color={cores.primaria} />
              <Text style={[styles.menuItemTexto, styles.menuItemTextoPrimaria]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemUltimo]}
              onPress={() => handleAcao(() => onExcluir(produto.id))}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${produto.nome}`}
            >
              <Ionicons name="trash-outline" size={18} color={cores.perigo} />
              <Text style={[styles.menuItemTexto, styles.menuItemTextoPerigo]}>Remover</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}
