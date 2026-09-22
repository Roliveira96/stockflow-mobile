import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FiltroProdutos } from "@/components/FiltroProdutos";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { styles } from "@/styles/produtos.styles";
import type { Produto, StatusFiltro } from "@/types";

export default function ListaDeProdutos() {
  const router = useRouter();
  const { logout } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");

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

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      if (termo.length > 0 && !produto.nome.toLowerCase().includes(termo)) {
        return false;
      }

      if (filtroStatus === "ativos") return produto.ativo;
      if (filtroStatus === "sem-estoque") return produto.quantidade === 0;
      if (filtroStatus === "inativos") return !produto.ativo;
      return true;
    });
  }, [produtos, busca, filtroStatus]);

  async function handleExcluir(id: string) {
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((atual) => atual.filter((produto) => produto.id !== id));
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível remover o produto.");
    }
  }

  function handleEditar(id: string) {
    router.push({ pathname: "/editar-produto", params: { id } });
  }

  function handleVisualizar(id: string) {
    router.push({ pathname: "/visualizar-produto", params: { id } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Produtos</Text>
        <CustomButton titulo="Sair" onPress={logout} estiloContainer={styles.botaoSair} />
      </View>

      <FiltroProdutos
        produtos={produtos}
        busca={busca}
        aoMudarBusca={setBusca}
        filtroStatus={filtroStatus}
        aoMudarFiltroStatus={setFiltroStatus}
      />

      {carregando ? (
        <ActivityIndicator style={styles.carregando} size="large" color="#208AEF" />
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(produto) => produto.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <ProductCard
              produto={item}
              onExcluir={handleExcluir}
              onEditar={handleEditar}
              onVisualizar={handleVisualizar}
            />
          )}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto encontrado.</Text>}
        />
      )}

      <View style={styles.rodape}>
        <CustomButton titulo="Novo produto" onPress={() => router.push("/novo-produto")} />
      </View>
    </SafeAreaView>
  );
}
