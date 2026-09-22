import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";

import { ProdutoForm } from "@/components/ProdutoForm";
import { cores } from "@/constants/theme";
import { api } from "@/services/api";
import { styles } from "@/styles/produto-formulario.styles";
import type { DadosProduto, Produto } from "@/types";
import { compararProdutos } from "@/utils/logProduto";

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
    if (!produto) return;

    setEnviando(true);

    try {
      const alteracoes = compararProdutos(produto, dados);
      const agora = new Date().toISOString();

      await api.put(`/produtos/${id}`, {
        ...dados,
        criadoEm: produto.criadoEm,
        atualizadoEm: agora,
      });

      if (alteracoes.length > 0) {
        await api.post("/logs", {
          produtoId: id,
          produtoNome: dados.nome,
          data: agora,
          alteracoes,
        });
      }

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
        <ActivityIndicator
          style={styles.carregando}
          size="large"
          color={cores.primaria}
          accessibilityLabel="Carregando produto"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Editar produto</Text>
          <ProdutoForm
            valoresIniciais={produto}
            textoBotao="Atualizar"
            enviando={enviando}
            aoEnviar={handleAtualizar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
