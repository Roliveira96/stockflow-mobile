import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text } from "react-native";

import { ProdutoForm } from "@/components/ProdutoForm";
import { api } from "@/services/api";
import { styles } from "@/styles/produto-formulario.styles";
import type { DadosProduto, Produto } from "@/types";

export default function EditarProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function buscarProduto() {
      try {
        const resposta = await api.get<Produto>(`/produtos/${id}`);
        setProduto(resposta.data);
      } catch {
        Alert.alert("Erro de conexão", "Não foi possível carregar o produto.");
        router.back();
      } finally {
        setCarregando(false);
      }
    }

    buscarProduto();
  }, [id, router]);

  async function handleAtualizar(dados: DadosProduto) {
    setEnviando(true);

    try {
      await api.put(`/produtos/${id}`, dados);
      Alert.alert("Produto atualizado", "As alterações foram salvas com sucesso.");
      router.back();
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível atualizar o produto.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando || !produto) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={styles.carregando} size="large" color="#208AEF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Editar produto</Text>
        <ProdutoForm
          valoresIniciais={produto}
          textoBotao="Atualizar"
          enviando={enviando}
          aoEnviar={handleAtualizar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
