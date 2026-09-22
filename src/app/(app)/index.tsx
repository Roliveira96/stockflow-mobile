import Ionicons from "@expo/vector-icons/Ionicons";
import type { CellRendererProps } from "@react-native/virtualized-lists";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FiltroProdutos } from "@/components/FiltroProdutos";
import { MenuLateral } from "@/components/MenuLateral";
import { ProductCard } from "@/components/ProductCard";
import { cores } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { buscarProdutosPaginado, buscarSugestoesProdutos } from "@/services/produtos";
import { styles } from "@/styles/produtos.styles";
import type { Produto, StatusFiltro } from "@/types";

export default function ListaDeProdutos() {
  const router = useRouter();
  const { logout } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalItens, setTotalItens] = useState(0);
  const [temMaisPaginas, setTemMaisPaginas] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");
  const [sugestoes, setSugestoes] = useState<Produto[]>([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtoMenuAbertoId, setProdutoMenuAbertoId] = useState<string | null>(null);

  useEffect(() => {
    const temporizador = setTimeout(() => setBuscaDebounced(busca), 350);
    return () => clearTimeout(temporizador);
  }, [busca]);

  useEffect(() => {
    let ativo = true;

    const temporizador = setTimeout(async () => {
      try {
        const resultado = await buscarSugestoesProdutos(busca);
        if (ativo) {
          setSugestoes(resultado);
        }
      } catch {
        if (ativo) {
          setSugestoes([]);
        }
      }
    }, 250);

    return () => {
      ativo = false;
      clearTimeout(temporizador);
    };
  }, [busca]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarPrimeiraPagina() {
        setCarregando(true);

        try {
          const resposta = await buscarProdutosPaginado({
            pagina: 1,
            busca: buscaDebounced,
            filtroStatus,
          });

          if (ativo) {
            setProdutos(resposta.itens);
            setPagina(resposta.paginaAtual);
            setTotalItens(resposta.totalItens);
            setTemMaisPaginas(!resposta.ehUltimaPagina);
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

      carregarPrimeiraPagina();

      return () => {
        ativo = false;
      };
    }, [buscaDebounced, filtroStatus])
  );

  async function handleCarregarMais() {
    if (carregando || carregandoMais || !temMaisPaginas) return;

    setCarregandoMais(true);

    try {
      const proximaPagina = pagina + 1;
      const resposta = await buscarProdutosPaginado({
        pagina: proximaPagina,
        busca: buscaDebounced,
        filtroStatus,
      });

      setProdutos((atual) => [...atual, ...resposta.itens]);
      setPagina(resposta.paginaAtual);
      setTemMaisPaginas(!resposta.ehUltimaPagina);
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível carregar mais produtos.");
    } finally {
      setCarregandoMais(false);
    }
  }

  function handleExcluir(id: string) {
    const produto = produtos.find((item) => item.id === id);

    Alert.alert(
      "Remover produto",
      `Tem certeza que deseja remover "${produto?.nome ?? "este produto"}"? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/produtos/${id}`);
              setProdutos((atual) => atual.filter((item) => item.id !== id));
              setTotalItens((atual) => Math.max(0, atual - 1));
            } catch {
              Alert.alert("Erro de conexão", "Não foi possível remover o produto.");
            }
          },
        },
      ]
    );
  }

  function handleEditar(id: string) {
    router.push({ pathname: "/editar-produto", params: { id } });
  }

  function handleVisualizar(id: string) {
    router.push({ pathname: "/visualizar-produto", params: { id } });
  }

  function renderizarCelula({ item, style, children, ...resto }: CellRendererProps<Produto>) {
    const celulaComMenuAberto = produtoMenuAbertoId === item.id;

    return (
      <View
        style={[style, celulaComMenuAberto ? styles.celulaComMenuAberto : undefined]}
        {...resto}
      >
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoMenu}
          onPress={() => setMenuAberto(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
        >
          <Ionicons name="menu" size={22} color={cores.textoPrimario} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Produtos</Text>
      </View>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        nomeUsuario="Ricardo"
        aoSair={() => {
          setMenuAberto(false);
          logout();
        }}
      />

      <FiltroProdutos
        sugestoes={sugestoes}
        busca={busca}
        aoMudarBusca={setBusca}
        filtroStatus={filtroStatus}
        aoMudarFiltroStatus={setFiltroStatus}
      />

      {carregando ? (
        <ActivityIndicator
          style={styles.carregando}
          size="large"
          color={cores.primaria}
          accessibilityLabel="Carregando produtos"
        />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(produto) => produto.id}
          style={styles.listaContainer}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <ProductCard
              produto={item}
              onExcluir={handleExcluir}
              onEditar={handleEditar}
              onVisualizar={handleVisualizar}
              menuAberto={produtoMenuAbertoId === item.id}
              aoAlternarMenu={() =>
                setProdutoMenuAbertoId((atual) => (atual === item.id ? null : item.id))
              }
            />
          )}
          CellRendererComponent={renderizarCelula}
          onEndReached={handleCarregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto encontrado.</Text>}
          ListFooterComponent={
            carregandoMais ? (
              <ActivityIndicator
                style={styles.carregandoMais}
                size="small"
                color={cores.primaria}
                accessibilityLabel="Carregando mais produtos"
              />
            ) : null
          }
        />
      )}

      {!carregando && totalItens > 0 ? (
        <Text style={styles.contador}>
          Mostrando {produtos.length} de {totalItens} produto{totalItens === 1 ? "" : "s"}
        </Text>
      ) : null}

      <View style={styles.rodape}>
        <CustomButton
          titulo="Novo produto"
          onPress={() => router.push("/novo-produto")}
          icone="add-circle-outline"
        />
      </View>
    </SafeAreaView>
  );
}
