import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { ProductCardProps } from "@/types";
import { calcularNivelEstoque } from "@/utils/estoque";
import { formatarMoeda } from "@/utils/moeda";

import { criarEstilos } from "./styles";

export function ProductCard({
  produto,
  onExcluir,
  onEditar,
  onVisualizar,
  menuAberto,
  aoAlternarMenu,
  vencimento,
}: ProductCardProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const nivel = calcularNivelEstoque(produto.quantidade);

  const estiloSelo =
    nivel === "critico"
      ? styles.seloCritico
      : nivel === "baixo"
        ? styles.seloBaixo
        : styles.seloNormal;
  const estiloSeloTexto =
    nivel === "critico"
      ? styles.seloTextoCritico
      : nivel === "baixo"
        ? styles.seloTextoBaixo
        : styles.seloTextoNormal;

  const temVencido = (vencimento?.lotesVencidos.length ?? 0) > 0;
  const prazoVencendo = vencimento?.menorPrazoDias ?? null;
  const textoVencimento = temVencido
    ? "Lote vencido"
    : prazoVencendo === null
      ? null
      : prazoVencendo === 0
        ? "Vence hoje"
        : `Vence em ${prazoVencendo}d`;

  function handleAcao(acao: () => void) {
    aoAlternarMenu();
    acao();
  }

  return (
    <View style={[styles.card, produto.ativo ? undefined : styles.cardInativo]}>
      <TouchableOpacity
        style={styles.conteudo}
        onPress={() => onVisualizar(produto.id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${produto.nome}`}
      >
        <View style={styles.iconeCategoria}>
          <Text style={styles.iconeCategoriaTexto}>{produto.categoriaIcone ?? "📦"}</Text>
        </View>

        <View style={styles.textos}>
          <Text style={styles.nome} numberOfLines={1}>
            {produto.nome}
          </Text>
          <View style={styles.linhaDetalhes}>
            <View style={[styles.selo, estiloSelo]}>
              <Text style={[styles.seloTexto, estiloSeloTexto]}>{produto.quantidade} un.</Text>
            </View>
            {!produto.ativo ? (
              <View style={[styles.selo, styles.seloInativo]}>
                <Text style={[styles.seloTexto, styles.seloTextoInativo]}>Inativo</Text>
              </View>
            ) : null}
            {textoVencimento ? (
              <View
                style={[styles.seloVencimento, temVencido ? styles.seloVencido : undefined]}
                accessibilityLabel={
                  temVencido
                    ? "Produto com lote vencido"
                    : `Produto com lote perto do vencimento: ${textoVencimento}`
                }
              >
                <Ionicons
                  name={temVencido ? "alert-circle" : "time-outline"}
                  size={11}
                  color={temVencido ? cores.perigo : cores.alerta}
                />
                <Text
                  style={[
                    styles.seloTexto,
                    temVencido ? styles.seloTextoCritico : styles.seloTextoBaixo,
                  ]}
                >
                  {textoVencimento}
                </Text>
              </View>
            ) : null}
            <Text style={styles.separador}>•</Text>
            <Text style={styles.codigo} numberOfLines={1}>
              {produto.codigoBarras}
            </Text>
          </View>
        </View>

        <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.botaoMenu, menuAberto ? styles.botaoMenuAtivo : undefined]}
          onPress={aoAlternarMenu}
          accessibilityRole="button"
          accessibilityLabel={`Mais ações para ${produto.nome}`}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={16} color={cores.textoTerciario} />
        </TouchableOpacity>

        {menuAberto ? (
          <View style={styles.menuPainel}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAcao(() => onVisualizar(produto.id))}
              accessibilityRole="button"
              accessibilityLabel={`Visualizar ${produto.nome}`}
            >
              <Ionicons name="eye-outline" size={17} color={cores.textoSecundario} />
              <Text style={styles.menuItemTexto}>Visualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAcao(() => onEditar(produto.id))}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${produto.nome}`}
            >
              <Ionicons name="create-outline" size={17} color={cores.primaria} />
              <Text style={[styles.menuItemTexto, styles.menuItemTextoPrimaria]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemUltimo]}
              onPress={() => handleAcao(() => onExcluir(produto.id))}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${produto.nome}`}
            >
              <Ionicons name="trash-outline" size={17} color={cores.perigo} />
              <Text style={[styles.menuItemTexto, styles.menuItemTextoPerigo]}>Remover</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}
