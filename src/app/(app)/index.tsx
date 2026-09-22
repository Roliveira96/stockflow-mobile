import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { styles } from "@/styles/produtos.styles";
import type { Produto } from "@/types";

export default function ListaDeProdutos() {
  const router = useRouter();
  const { logout } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function buscarProdutos() {
        try {
          const resposta = await api.get<Produto[]>("/produtos");
          if (ativo) {
            setProdutos(resposta.data);
          }
        } catch {
          if (ativo) {
            Alert.alert("Erro de conexão", "Não foi possível carregar os produtos.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      buscarProdutos();

      return () => {
        ativo = false;
      };
    }, [])
  );

  async function handleExcluir(id: string) {
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((atual) => atual.filter((produto) => produto.id !== id));
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível remover o produto.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Produtos</Text>
        <CustomButton titulo="Sair" onPress={logout} estiloContainer={styles.botaoSair} />
      </View>

      {carregando ? (
        <ActivityIndicator style={styles.carregando} size="large" color="#208AEF" />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(produto) => produto.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => <ProductCard produto={item} onExcluir={handleExcluir} />}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto cadastrado ainda.</Text>}
        />
      )}

      <View style={styles.rodape}>
        <CustomButton titulo="Novo produto" onPress={() => router.push("/novo-produto")} />
      </View>
    </SafeAreaView>
  );
}
