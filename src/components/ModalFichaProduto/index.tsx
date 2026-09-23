import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FolhaInferior } from "@/components/FolhaInferior";
import { useTema } from "@/contexts/TemaContext";
import type { ModalFichaProdutoProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";

import { criarEstilos } from "./styles";

export function ModalFichaProduto({ produto, aoFechar, aoAdicionar }: ModalFichaProdutoProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const semEstoque = (produto?.quantidade ?? 0) <= 0;

  return (
    <FolhaInferior
      visivel={produto !== null}
      aoFechar={aoFechar}
      titulo={
        <View style={styles.seloSeguro}>
          <Ionicons name="shield-checkmark-outline" size={14} color={cores.sucesso} />
          <Text style={styles.seloSeguroTexto}>Visão do cliente</Text>
        </View>
      }
      subtitulo="Sem custo, margem ou dados internos"
      rodape={
        <>
          <CustomButton
            titulo="Fechar"
            onPress={aoFechar}
            variante="neutro"
            compacto
            estiloContainer={styles.botaoSecundario}
          />
          <CustomButton
            titulo="Adicionar ao carrinho"
            onPress={() => produto && aoAdicionar(produto)}
            icone="cart-outline"
            compacto
            estiloContainer={styles.botaoPrincipal}
          />
        </>
      }
    >
      {produto ? (
        <>
          <View style={styles.cabecalho}>
            <View style={styles.icone}>
              <Text style={styles.iconeTexto}>{produto.categoriaIcone ?? "📦"}</Text>
            </View>
            <View style={styles.flex}>
              {produto.categoria ? <Text style={styles.categoria}>{produto.categoria}</Text> : null}
              <Text style={styles.nome}>{produto.nome}</Text>
              <View style={styles.codigos}>
                <Text style={styles.codigoBarras}>{produto.codigoBarras}</Text>
                {produto.codigoAuxiliar ? (
                  <View style={styles.seloCodigo}>
                    <Text style={styles.seloCodigoTexto}>{produto.codigoAuxiliar}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.metricas}>
            <View style={[styles.metrica, styles.metricaPreco]}>
              <Text style={styles.metricaRotuloPreco}>Preço à vista / cartão</Text>
              <Text style={styles.metricaValorPreco}>{formatarMoeda(produto.preco)}</Text>
            </View>
            <View style={styles.metrica}>
              <Text style={styles.metricaRotulo}>Estoque loja</Text>
              <Text
                style={[styles.metricaValor, semEstoque ? styles.valorPerigo : styles.valorSucesso]}
              >
                {produto.quantidade} un.
              </Text>
            </View>
          </View>

          {semEstoque ? (
            <View style={styles.avisoSemEstoque}>
              <Ionicons name="alert-circle-outline" size={16} color={cores.alerta} />
              <Text style={styles.avisoSemEstoqueTexto}>
                Sem estoque no sistema. A venda é permitida e deixa o estoque negativo, para
                corrigir depois na contagem.
              </Text>
            </View>
          ) : null}

          <View>
            <Text style={styles.rotuloDescricao}>Especificações & conteúdo</Text>
            <View style={styles.descricaoCaixa}>
              <Text style={styles.descricaoTexto}>
                {produto.descricao || "Nenhuma especificação cadastrada para este produto."}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </FolhaInferior>
  );
}
