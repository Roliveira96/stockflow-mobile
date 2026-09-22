import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text } from "react-native";

import { ProdutoForm } from "@/components/ProdutoForm";
import { api } from "@/services/api";
import { styles } from "@/styles/produto-formulario.styles";
import type { DadosProduto } from "@/types";

export default function NovoProduto() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  async function handleSalvar(dados: DadosProduto) {
    setEnviando(true);

    try {
      await api.post("/produtos", dados);
      Alert.alert("Produto criado", "O produto foi cadastrado com sucesso.");
      router.back();
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível salvar o produto.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Novo produto</Text>
        <ProdutoForm textoBotao="Salvar" enviando={enviando} aoEnviar={handleSalvar} />
      </ScrollView>
    </SafeAreaView>
  );
}
