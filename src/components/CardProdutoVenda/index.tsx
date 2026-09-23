import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { SeletorQuantidade } from "@/components/SeletorQuantidade";
import { useTema } from "@/contexts/TemaContext";
import type { CardProdutoVendaProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

import { criarEstilos } from "./styles";

export function CardProdutoVenda({
  produto,
  quantidadeNoCarrinho,
  aoAumentar,
  aoDiminuir,
  aoAbrirFicha,
}: CardProdutoVendaProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const semEstoque = produto.quantidade <= 0;

  return (
    <View style={[styles.card, quantidadeNoCarrinho > 0 ? styles.cardNoCarrinho : undefined]}>
      <TouchableOpacity
        style={styles.conteudo}
        onPress={aoAbrirFicha}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Ver ficha de ${produto.nome}`}
      >
        <View style={styles.icone}>
          <Text style={styles.iconeTexto}>{produto.categoriaIcone ?? "📦"}</Text>
        </View>
        <View style={styles.textos}>
          <Text style={styles.nome} numberOfLines={1}>
            {produto.nome}
          </Text>
          <View style={styles.linhaDetalhes}>
            {produto.codigoAuxiliar ? (
              <View style={styles.seloCodigo}>
                <Text style={styles.seloCodigoTexto} numberOfLines={1}>
                  {produto.codigoAuxiliar}
                </Text>
              </View>
            ) : null}
            <Text style={[styles.estoque, semEstoque ? styles.estoqueEsgotado : undefined]}>
              {semEstoque
                ? `Sem estoque (${produto.quantidade})`
                : `${produto.quantidade} em estoque`}
            </Text>
          </View>
          <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
        </View>
      </TouchableOpacity>

      <SeletorQuantidade
        quantidade={quantidadeNoCarrinho}
        aoAumentar={aoAumentar}
        aoDiminuir={aoDiminuir}
      />
    </View>
  );
}
