import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { api } from "@/services/api";
import { styles } from "@/styles/visualizar-produto.styles";
import type { LogEdicao, Produto } from "@/types";
import { formatarData } from "@/utils/data";
import { formatarMoeda } from "@/utils/moeda";

export default function VisualizarProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [logs, setLogs] = useState<LogEdicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function buscarDados() {
        try {
          const [respostaProduto, respostaLogs] = await Promise.all([
            api.get<Produto>(`/produtos/${id}`),
            api.get<LogEdicao[]>("/logs", { params: { produtoId: id } }),
          ]);

          if (ativo) {
            setProduto(respostaProduto.data);
            setLogs([...respostaLogs.data].reverse());
          }
        } catch {
          if (ativo) {
            Alert.alert("Erro de conexão", "Não foi possível carregar o produto.");
            router.back();
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      buscarDados();

      return () => {
        ativo = false;
      };
    }, [id, router])
  );

  async function handleExcluir() {
    setExcluindo(true);

    try {
      await api.delete(`/produtos/${id}`);
      router.back();
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível remover o produto.");
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando || !produto) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={styles.carregando} size="large" color="#208AEF" />
      </SafeAreaView>
    );
  }

  const ultimasUnidades = produto.quantidade > 0 && produto.quantidade < 5;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <View style={styles.selos}>
            <View style={[styles.selo, produto.ativo ? undefined : styles.seloInativo]}>
              <Text
                style={[styles.seloTexto, produto.ativo ? undefined : styles.seloTextoInativo]}
              >
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

        <View style={styles.cartao}>
          <View style={styles.linha}>
            <Text style={styles.linhaRotulo}>Código de barras</Text>
            <Text style={styles.linhaValor}>{produto.codigoBarras}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaRotulo}>Quantidade</Text>
            <Text style={styles.linhaValor}>{produto.quantidade}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaRotulo}>Preço</Text>
            <Text style={styles.linhaValor}>{formatarMoeda(produto.preco)}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaRotulo}>Criado em</Text>
            <Text style={styles.linhaValor}>{formatarData(produto.criadoEm)}</Text>
          </View>
          <View style={[styles.linha, styles.linhaSemBorda]}>
            <Text style={styles.linhaRotulo}>Última atualização</Text>
            <Text style={styles.linhaValor}>{formatarData(produto.atualizadoEm)}</Text>
          </View>
          {produto.descricao ? <Text style={styles.descricaoTexto}>{produto.descricao}</Text> : null}
        </View>

        <View style={styles.acoes}>
          <CustomButton
            titulo="Editar"
            onPress={() => router.push({ pathname: "/editar-produto", params: { id } })}
            estiloContainer={styles.botaoAcao}
          />
          <CustomButton
            titulo="Excluir"
            onPress={handleExcluir}
            carregando={excluindo}
            estiloContainer={[styles.botaoAcao, styles.botaoExcluir]}
          />
        </View>

        <Text style={styles.subtitulo}>Histórico de alterações</Text>
        {logs.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma alteração registrada ainda.</Text>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <Text style={styles.logData}>{formatarData(log.data)}</Text>
              {log.alteracoes.map((alteracao, indice) => (
                <Text key={indice} style={styles.logAlteracao}>
                  <Text style={styles.logCampo}>{alteracao.campo}</Text>: {alteracao.de} →{" "}
                  {alteracao.para}
                </Text>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
