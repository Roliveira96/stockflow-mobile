import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MenuLateral } from "@/components/MenuLateral";
import { ModalCategoria } from "@/components/ModalCategoria";
import { CARGO_USUARIO, NOME_USUARIO } from "@/constants/usuario";
import { useAuth } from "@/contexts/AuthContext";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { listarCategorias } from "@/services/categorias";
import { buscarLotesComValidadeProxima, buscarProdutosPaginado } from "@/services/produtos";
import { listarPedidos } from "@/services/vendas";
import { criarEstilos } from "@/styles/dashboard.styles";
import type { Pedido } from "@/types";
import {
  calcularResumoDashboard,
  formatarDataExtenso,
  formatarHora,
  obterSaudacao,
  type ResumoDashboard,
} from "@/utils/dashboard";
import { formatarMoeda } from "@/utils/moeda";
import { rotuloFormaPagamento } from "@/utils/venda";

export default function Dashboard() {
  const router = useRouter();
  const params = useLocalSearchParams<{ intro?: string }>();
  const { cores } = useTema();
  const { usuario, logout } = useAuth();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const nomeExibicao = usuario?.nome
    ? usuario.nome.charAt(0).toUpperCase() + usuario.nome.slice(1)
    : NOME_USUARIO;

  const [mostrarIntro, setMostrarIntro] = useState(params.intro === "1");
  const [passoIntro, setPassoIntro] = useState<"saudacao" | "preparando">("saudacao");

  const [opacidadeSaudacao] = useState(() => new Animated.Value(0));
  const [escalaSaudacao] = useState(() => new Animated.Value(0.92));
  const [opacidadePreparando] = useState(() => new Animated.Value(0));
  const [progressoBarra] = useState(() => new Animated.Value(0));

  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [recarregando, setRecarregando] = useState(false);

  const [totalProdutos, setTotalProdutos] = useState(0);
  const [produtosCriticos, setProdutosCriticos] = useState(0);
  const [lotesVencendo, setLotesVencendo] = useState(0);
  const [pedidosPendentesCaixa, setPedidosPendentesCaixa] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);

  const [menuAberto, setMenuAberto] = useState(false);
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);

  const pularIntro = useCallback(() => {
    setMostrarIntro(false);
  }, []);

  useEffect(() => {
    if (!mostrarIntro) return;

    let cancelado = false;

    Animated.parallel([
      Animated.timing(opacidadeSaudacao, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(escalaSaudacao, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const timerPasso1 = setTimeout(() => {
      if (cancelado) return;

      Animated.timing(opacidadeSaudacao, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        if (cancelado) return;
        setPassoIntro("preparando");

        Animated.parallel([
          Animated.timing(opacidadePreparando, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(progressoBarra, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]).start();

        const timerPasso2 = setTimeout(() => {
          if (cancelado) return;

          Animated.timing(opacidadePreparando, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            if (!cancelado) {
              setMostrarIntro(false);
            }
          });
        }, 1300);

        return () => clearTimeout(timerPasso2);
      });
    }, 1400);

    return () => {
      cancelado = true;
      clearTimeout(timerPasso1);
    };
  }, [mostrarIntro, opacidadeSaudacao, escalaSaudacao, opacidadePreparando, progressoBarra]);

  const carregarDados = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setCarregando(true);
    } else {
      setRecarregando(true);
    }

    try {
      const [todosPedidos, respostaProdutos, lotesCriticos, categorias] = await Promise.all([
        listarPedidos().catch(() => [] as Pedido[]),
        buscarProdutosPaginado({ pagina: 1, busca: "", filtroStatus: "todos" }).catch(() => null),
        buscarLotesComValidadeProxima().catch(() => []),
        listarCategorias().catch(() => []),
      ]);

      const resumoCalculado = calcularResumoDashboard(todosPedidos, nomeExibicao);
      setResumo(resumoCalculado);

      setPedidosPendentesCaixa(
        todosPedidos.filter((p) => p.status === "AGUARDANDO").length
      );

      if (respostaProdutos) {
        setTotalProdutos(respostaProdutos.totalItens);
        const criticos = respostaProdutos.itens.filter((item) => item.quantidade < 5).length;
        setProdutosCriticos(criticos);
      }

      setLotesVencendo(lotesCriticos.length);
      setTotalCategorias(categorias.length);
    } catch {
      // Falha tratada silenciosamente para manter UX
    } finally {
      setCarregando(false);
      setRecarregando(false);
    }
  }, [nomeExibicao]);

  useFocusEffect(
    useCallback(() => {
      carregarDados(true);
    }, [carregarDados])
  );

  const saudacaoMomento = useMemo(() => obterSaudacao(), []);
  const dataHojeExtenso = useMemo(() => formatarDataExtenso(), []);

  const larguraBarra = progressoBarra.interpolate({
    inputRange: [0, 1],
    outputRange: ["10%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {mostrarIntro ? (
        <View style={styles.introContainer}>
          {passoIntro === "saudacao" ? (
            <Animated.View
              style={[
                styles.introCartao,
                {
                  opacity: opacidadeSaudacao,
                  transform: [{ scale: escalaSaudacao }],
                },
              ]}
            >
              <View style={styles.introIconeContainer}>
                <Ionicons
                  name={saudacaoMomento === "Boa noite" ? "moon" : "sunny"}
                  size={36}
                  color={cores.primaria}
                />
              </View>
              <Text style={styles.introTitulo}>{saudacaoMomento}, {nomeExibicao}!</Text>
              <Text style={styles.introSubtitulo}>
                Bem-vindo de volta ao StockFlow.
              </Text>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.introCartao, { opacity: opacidadePreparando }]}>
              <View style={styles.introIconeContainer}>
                <Ionicons name="sparkles" size={34} color={cores.primaria} />
              </View>
              <Text style={styles.introTitulo}>Estamos preparando o seu ambiente...</Text>
              <Text style={styles.introSubtitulo}>
                Sincronizando vendas, caixa e indicadores de estoque.
              </Text>

              <View style={styles.introBarraContainer}>
                <Animated.View style={[styles.introBarraProgresso, { width: larguraBarra }]} />
              </View>
            </Animated.View>
          )}

          <TouchableOpacity
            style={styles.introBotaoPular}
            onPress={pularIntro}
            accessibilityRole="button"
            accessibilityLabel="Pular animação de introdução"
          >
            <Text style={styles.introTextoPular}>Pular introdução ›</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoInfo}>
          <Text style={styles.cabecalhoData}>{dataHojeExtenso}</Text>
          <Text style={styles.cabecalhoTitulo}>Dashboard</Text>
        </View>

        <View style={styles.cabecalhoAcoes}>
          <TouchableOpacity
            style={styles.botaoCabecalho}
            onPress={() => carregarDados(true)}
            accessibilityRole="button"
            accessibilityLabel="Atualizar dados do dashboard"
          >
            <Ionicons
              name={recarregando ? "hourglass-outline" : "refresh-outline"}
              size={18}
              color={cores.textoSecundario}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoCabecalho}
            onPress={() => setMenuAberto(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir menu lateral"
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{nomeExibicao[0]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {carregando && !resumo && !mostrarIntro ? (
        <View style={styles.vazioContainer}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.conteudo}
          refreshControl={
            <RefreshControl
              refreshing={recarregando}
              onRefresh={() => carregarDados(true)}
              tintColor={cores.primaria}
              colors={[cores.primaria]}
            />
          }
        >
        <View style={styles.heroCard}>
          <View style={styles.heroLinhaTopo}>
            <Text style={styles.heroRotulo}>Vendas de Hoje</Text>
            <View style={styles.heroIcone}>
              <Ionicons name="wallet-outline" size={22} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.heroValor}>
            {formatarMoeda(resumo?.totalVendasHoje ?? 0)}
          </Text>

          <View style={styles.heroLinhaRodape}>
            <View style={styles.heroBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeTexto}>
                {resumo?.pedidosPagosHoje ?? 0} pedido(s) concluído(s)
              </Text>
            </View>
            <Text style={styles.heroSubtexto}>
              Média: {formatarMoeda(resumo?.ticketMedioHoje ?? 0)}
            </Text>
          </View>
        </View>

        <View style={styles.gridMetricas}>
          <View style={styles.cartaoMetrica}>
            <View style={styles.cartaoMetricaTopo}>
              <Text style={styles.cartaoMetricaRotulo}>Em seu nome</Text>
              <View style={[styles.cartaoMetricaIcone, styles.iconeFundoPrimaria]}>
                <Ionicons name="person-outline" size={14} color={cores.primaria} />
              </View>
            </View>
            <Text style={styles.cartaoMetricaValor}>
              {resumo?.pedidosEmNomeUsuarioHoje ?? 0} pedidos
            </Text>
            <Text style={styles.cartaoMetricaSubtexto}>
              Total: {formatarMoeda(resumo?.totalVendasUsuarioHoje ?? 0)}
            </Text>
          </View>

          <View style={styles.cartaoMetrica}>
            <View style={styles.cartaoMetricaTopo}>
              <Text style={styles.cartaoMetricaRotulo}>Ticket médio</Text>
              <View style={[styles.cartaoMetricaIcone, styles.iconeFundoSucesso]}>
                <Ionicons name="trending-up-outline" size={14} color={cores.sucesso} />
              </View>
            </View>
            <Text style={styles.cartaoMetricaValor}>
              {formatarMoeda(resumo?.ticketMedioHoje ?? 0)}
            </Text>
            <Text style={styles.cartaoMetricaSubtexto}>Por venda concluída</Text>
          </View>

          <View style={styles.cartaoMetrica}>
            <View style={styles.cartaoMetricaTopo}>
              <Text style={styles.cartaoMetricaRotulo}>Itens vendidos</Text>
              <View style={[styles.cartaoMetricaIcone, styles.iconeFundoNeutro]}>
                <Ionicons name="cube-outline" size={14} color={cores.neutroTexto} />
              </View>
            </View>
            <Text style={styles.cartaoMetricaValor}>
              {resumo?.itensVendidosHoje ?? 0} un.
            </Text>
            <Text style={styles.cartaoMetricaSubtexto}>No dia de hoje</Text>
          </View>

          <View style={styles.cartaoMetrica}>
            <View style={styles.cartaoMetricaTopo}>
              <Text style={styles.cartaoMetricaRotulo}>No Caixa</Text>
              <View style={[styles.cartaoMetricaIcone, styles.iconeFundoAlerta]}>
                <Ionicons name="time-outline" size={14} color={cores.alerta} />
              </View>
            </View>
            <Text style={styles.cartaoMetricaValor}>
              {resumo?.pedidosAguardandoHoje ?? 0} pedidos
            </Text>
            <Text style={styles.cartaoMetricaSubtexto}>Aguardando pagamento</Text>
          </View>
        </View>

        <View style={styles.atalhosContainer}>
          <TouchableOpacity
            style={styles.botaoAtalho}
            onPress={() => router.push("/caixa")}
            accessibilityRole="button"
            accessibilityLabel="Abrir frente de caixa"
          >
            <View style={[styles.botaoAtalhoIcone, styles.iconeFundoPrimaria]}>
              <Ionicons name="cash-outline" size={18} color={cores.primaria} />
            </View>
            <Text style={styles.botaoAtalhoTexto}>Frente de Caixa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoAtalho}
            onPress={() => router.push("/")}
            accessibilityRole="button"
            accessibilityLabel="Ver catálogo de produtos"
          >
            <View style={[styles.botaoAtalhoIcone, styles.iconeFundoSucesso]}>
              <Ionicons name="cube-outline" size={18} color={cores.sucesso} />
            </View>
            <Text style={styles.botaoAtalhoTexto}>Produtos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoAtalho}
            onPress={() => router.push("/vendas")}
            accessibilityRole="button"
            accessibilityLabel="Ver histórico de vendas"
          >
            <View style={[styles.botaoAtalhoIcone, styles.iconeFundoAlerta]}>
              <Ionicons name="bag-handle-outline" size={18} color={cores.alerta} />
            </View>
            <Text style={styles.botaoAtalhoTexto}>Vendas</Text>
          </TouchableOpacity>
        </View>

        {produtosCriticos > 0 || lotesVencendo > 0 ? (
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Avisos Operacionais</Text>
            {produtosCriticos > 0 ? (
              <View style={[styles.alertaItem, styles.alertaItemCritico]}>
                <View style={styles.alertaConteudo}>
                  <Ionicons name="alert-circle" size={18} color={cores.perigo} />
                  <View>
                    <Text style={styles.alertaTextoTitulo}>
                      {produtosCriticos} produto(s) com estoque crítico
                    </Text>
                    <Text style={styles.alertaTextoSub}>Menos de 5 unidades restantes</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.alertaBotao}
                  onPress={() => router.push("/")}
                  accessibilityRole="button"
                  accessibilityLabel="Ver produtos críticos"
                >
                  <Text style={styles.alertaBotaoTexto}>Repor</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {lotesVencendo > 0 ? (
              <View style={styles.alertaItem}>
                <View style={styles.alertaConteudo}>
                  <Ionicons name="time" size={18} color={cores.alerta} />
                  <View>
                    <Text style={styles.alertaTextoTitulo}>
                      {lotesVencendo} lote(s) requerem atenção
                    </Text>
                    <Text style={styles.alertaTextoSub}>Lotes vencidos ou vencendo em 30 dias</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.alertaBotao}
                  onPress={() => router.push("/")}
                  accessibilityRole="button"
                  accessibilityLabel="Ver lotes com atenção"
                >
                  <Text style={styles.alertaBotaoTexto}>Conferir</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Formas de Pagamento Hoje</Text>

          {resumo?.formasPagamentoHoje.map((item) => (
            <View key={item.forma} style={styles.linhaForma}>
              <View style={styles.linhaFormaEsquerda}>
                <View style={styles.linhaFormaIcone}>
                  <Ionicons name={item.icone as any} size={16} color={cores.primaria} />
                </View>
                <View>
                  <Text style={styles.linhaFormaNome}>{item.rotulo}</Text>
                  <Text style={styles.linhaFormaQtd}>
                    {item.quantidade} transaç{item.quantidade === 1 ? "ão" : "ões"}
                  </Text>
                </View>
              </View>

              <View style={styles.linhaFormaDireita}>
                <Text style={styles.linhaFormaValor}>{formatarMoeda(item.total)}</Text>
                <View style={styles.barraProgressoContainer}>
                  <View
                    style={[
                      styles.barraProgressoPreenchida,
                      { width: `${Math.max(4, Math.round(item.percentual))}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.secao}>
          <View style={styles.secaoCabecalho}>
            <Text style={styles.secaoTitulo}>Pedidos Recentes de Hoje</Text>
            <TouchableOpacity
              onPress={() => router.push("/vendas")}
              accessibilityRole="button"
              accessibilityLabel="Ver histórico completo de vendas"
            >
              <Text style={styles.linkVerTodos}>Ver todos ›</Text>
            </TouchableOpacity>
          </View>

          {resumo && resumo.pedidosRecentesHoje.length > 0 ? (
            resumo.pedidosRecentesHoje.map((pedido) => (
              <TouchableOpacity
                key={pedido.id}
                style={styles.itemPedido}
                onPress={() => router.push("/vendas")}
                accessibilityRole="button"
                accessibilityLabel={`Ver pedido ${pedido.numero}`}
              >
                <View style={styles.itemPedidoEsquerda}>
                  <View
                    style={[
                      styles.itemPedidoStatusIcone,
                      pedido.status === "PAGO"
                        ? styles.iconeFundoSucesso
                        : pedido.status === "AGUARDANDO"
                          ? styles.iconeFundoAlerta
                          : styles.iconeFundoPerigo,
                    ]}
                  >
                    <Ionicons
                      name={
                        pedido.status === "PAGO"
                          ? "checkmark"
                          : pedido.status === "AGUARDANDO"
                            ? "time-outline"
                            : "close"
                      }
                      size={16}
                      color={
                        pedido.status === "PAGO"
                          ? cores.sucesso
                          : pedido.status === "AGUARDANDO"
                            ? cores.alerta
                            : cores.perigo
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.itemPedidoNumero}>{pedido.numero}</Text>
                    <Text style={styles.itemPedidoCliente} numberOfLines={1}>
                      {pedido.cliente?.nome || "Consumidor não identificado"} •{" "}
                      {rotuloFormaPagamento(pedido.formaPagamento)}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemPedidoDireita}>
                  <Text style={styles.itemPedidoValor}>{formatarMoeda(pedido.total)}</Text>
                  <Text style={styles.itemPedidoHora}>{formatarHora(pedido.criadoEm)}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.vazioContainer}>
              <Ionicons name="receipt-outline" size={28} color={cores.textoTerciario} />
              <Text style={styles.vazioTitulo}>Nenhuma venda registrada hoje</Text>
              <Text style={styles.vazioSubtexto}>
                Abra a Frente de Caixa para iniciar o primeiro atendimento do dia.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      )}

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        nomeUsuario={nomeExibicao}
        emailUsuario={usuario?.email ?? ""}
        cargoUsuario={CARGO_USUARIO}
        telaAtiva="dashboard"
        totalProdutos={totalProdutos}
        totalCategorias={totalCategorias}
        pedidosPendentes={pedidosPendentesCaixa}
        aoAbrirCategorias={() => {
          setMenuAberto(false);
          setModalCategoriaVisivel(true);
        }}
        aoSair={() => {
          setMenuAberto(false);
          logout();
        }}
      />

      <ModalCategoria
        visivel={modalCategoriaVisivel}
        aoFechar={() => setModalCategoriaVisivel(false)}
        aoCriar={(categoria) => {
          setTotalCategorias((atual) => atual + 1);
          mostrarToast(`Categoria "${categoria.nome}" criada com sucesso`);
        }}
      />
    </SafeAreaView>
  );
}
