import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Switch, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { api } from "@/services/api";
import { styles } from "@/styles/novo-produto.styles";

export default function NovoProduto() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [erroNome, setErroNome] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");
  const [erroPreco, setErroPreco] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroNome(
      nome.length > 0 && nome.trim().length < 3 ? "O nome deve ter ao menos 3 caracteres." : ""
    );
  }, [nome]);

  useEffect(() => {
    const valor = Number(quantidade.replace(",", "."));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroQuantidade(
      quantidade.length > 0 && (Number.isNaN(valor) || valor < 0)
        ? "A quantidade não pode ser negativa."
        : ""
    );
  }, [quantidade]);

  useEffect(() => {
    const valor = Number(preco.replace(",", "."));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroPreco(
      preco.length > 0 && (Number.isNaN(valor) || valor <= 0)
        ? "O preço deve ser maior que zero."
        : ""
    );
  }, [preco]);

  const formularioValido =
    nome.trim().length >= 3 &&
    !erroNome &&
    quantidade.trim().length > 0 &&
    !erroQuantidade &&
    preco.trim().length > 0 &&
    !erroPreco;

  async function handleSalvar() {
    setEnviando(true);

    try {
      await api.post("/produtos", {
        nome: nome.trim(),
        quantidade: Number(quantidade.replace(",", ".")),
        preco: Number(preco.replace(",", ".")),
        ativo,
      });

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

        <CustomInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          erro={erroNome}
          placeholder="Nome do produto"
        />
        <CustomInput
          label="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          erro={erroQuantidade}
          keyboardType="numeric"
          placeholder="0"
        />
        <CustomInput
          label="Preço"
          value={preco}
          onChangeText={setPreco}
          erro={erroPreco}
          keyboardType="numeric"
          placeholder="0,00"
        />

        <View style={styles.linhaSwitch}>
          <Text style={styles.rotuloSwitch}>Ativo para venda</Text>
          <Switch value={ativo} onValueChange={setAtivo} />
        </View>

        <CustomButton
          titulo="Salvar"
          onPress={handleSalvar}
          carregando={enviando}
          desabilitado={!formularioValido}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
