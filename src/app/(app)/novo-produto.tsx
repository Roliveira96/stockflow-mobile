import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import { BarraTopo } from "@/components/BarraTopo";
import { ProdutoForm } from "@/components/ProdutoForm";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { api } from "@/services/api";
import { criarEstilos } from "@/styles/produto-formulario.styles";
import type { DadosProduto, Produto } from "@/types";
import { gerarCodigoLote } from "@/utils/lote";

export default function NovoProduto() {
  const router = useRouter();
  const { cores } = useTema();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [enviando, setEnviando] = useState(false);
  const [versaoFormulario, setVersaoFormulario] = useState(0);

  async function handleSalvar(dados: DadosProduto) {
    setEnviando(true);

    try {
      const agora = new Date().toISOString();
      const resposta = await api.post<Produto>("/produtos", {
        ...dados,
        criadoEm: agora,
        atualizadoEm: agora,
      });

      if (dados.quantidade > 0 && dados.precoCusto) {
        await api.post("/lotes", {
          produtoId: resposta.data.id,
          codigo: gerarCodigoLote(),
          validade: null,
          quantidadeEntrada: dados.quantidade,
          saldoRestante: dados.quantidade,
          custoUnitario: dados.precoCusto,
          criadoEm: agora,
        });
      }

      Alert.alert("Produto criado", "O produto foi cadastrado com sucesso.");
      mostrarToast(`"${dados.nome}" cadastrado no catálogo`);
      router.back();
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível salvar o produto.");
    } finally {
      setEnviando(false);
    }
  }

  function handleLimpar() {
    setVersaoFormulario((atual) => atual + 1);
    mostrarToast("Formulário limpo");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraTopo
        rotuloVoltar="Voltar"
        aoVoltar={() => router.back()}
        direita={
          <TouchableOpacity
            style={styles.botaoTopo}
            onPress={handleLimpar}
            accessibilityRole="button"
            accessibilityLabel="Limpar formulário"
          >
            <Text style={styles.botaoTopoPerigo}>Limpar</Text>
          </TouchableOpacity>
        }
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Novo produto</Text>
          <Text style={styles.subtitulo}>Cadastre um novo item no inventário</Text>
          <ProdutoForm
            key={versaoFormulario}
            textoBotao="Salvar produto"
            enviando={enviando}
            aoEnviar={handleSalvar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
