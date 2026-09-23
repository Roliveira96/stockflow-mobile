import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";

import { BarraTopo } from "@/components/BarraTopo";
import { ProdutoForm } from "@/components/ProdutoForm";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { api } from "@/services/api";
import { criarEstilos } from "@/styles/produto-formulario.styles";
import type { DadosProduto, Produto } from "@/types";
import { compararProdutos } from "@/utils/logProduto";

export default function EditarProduto() {
  const router = useRouter();
  const { cores } = useTema();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
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
      mostrarToast("Alterações salvas com sucesso");
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
      <BarraTopo rotuloVoltar="Voltar" aoVoltar={() => router.back()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Editar produto</Text>
          <Text style={styles.subtitulo}>{produto.nome}</Text>
          <ProdutoForm
            valoresIniciais={produto}
            textoBotao="Salvar alterações"
            enviando={enviando}
            aoEnviar={handleAtualizar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
