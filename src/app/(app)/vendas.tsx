import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CardProdutoVenda } from "@/components/CardProdutoVenda";
import { CustomButton } from "@/components/CustomButton";
import { MenuLateral } from "@/components/MenuLateral";
import { ModalCliente } from "@/components/ModalCliente";
import { ModalFichaProduto } from "@/components/ModalFichaProduto";
import { SeletorQuantidade } from "@/components/SeletorQuantidade";
import { NOME_USUARIO, TERMINAL_VENDA } from "@/constants/usuario";
import { useAuth } from "@/contexts/AuthContext";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { useCampoMoeda } from "@/hooks/useCampoMoeda";
import { criarPedido, listarPedidos, listarProdutosVendaveis } from "@/services/vendas";
import { criarEstilos } from "@/styles/vendas.styles";
import type { Cliente, FormaPagamento, ItemCarrinho, Produto, TipoDesconto } from "@/types";
import { formatarMoeda } from "@/utils/moeda";
import {
  calcularDesconto,
  calcularSubtotal,
  DESCONTO_MAXIMO_PERCENTUAL,
  formatarCpf,
  FORMAS_PAGAMENTO,
  NOME_CONSUMIDOR_PADRAO,
} from "@/utils/venda";

type AbaVenda = "catalogo" | "carrinho";
type FiltroEstoque = "em-estoque" | "sem-estoque";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Vendas() {
  const { logout, usuario } = useAuth();
  const { cores } = useTema();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [abaAtiva, setAbaAtiva] = useState<AbaVenda>("catalogo");
  const [menuAberto, setMenuAberto] = useState(false);

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroEstoque, setFiltroEstoque] = useState<FiltroEstoque>("em-estoque");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [produtoFicha, setProdutoFicha] = useState<Produto | null>(null);

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [modalClienteVisivel, setModalClienteVisivel] = useState(false);
  const [tipoDesconto, setTipoDesconto] = useState<TipoDesconto>("percentual");
  const [descontoPercentual, setDescontoPercentual] = useState("");
  const campoDescontoValor = useCampoMoeda(0);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX");
  const [enviando, setEnviando] = useState(false);

  const [pedidosPendentes, setPedidosPendentes] = useState(0);

  const carregarDados = useCallback(async () => {
    try {
      const [listaProdutos, listaPedidos] = await Promise.all([
        listarProdutosVendaveis(),
        listarPedidos(),
      ]);

      setProdutos(listaProdutos);
      setPedidosPendentes(listaPedidos.filter((pedido) => pedido.status === "AGUARDANDO").length);
      setCarrinho((atual) =>
        atual
          .map((item) => {
            const produtoAtual = listaProdutos.find((produto) => produto.id === item.produto.id);
            return produtoAtual ? { ...item, produto: produtoAtual } : null;
          })
          .filter((item): item is ItemCarrinho => item !== null)
      );
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível carregar os produtos e pedidos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const categorias = useMemo(
    () =>
      [...new Set(produtos.map((produto) => produto.categoria).filter(Boolean))].sort() as string[],
    [produtos]
  );

  const totalEmEstoque = produtos.filter((produto) => produto.quantidade > 0).length;
  const totalSemEstoque = produtos.length - totalEmEstoque;

  const produtosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return produtos.filter((produto) => {
      const temEstoque = produto.quantidade > 0;
      if (filtroEstoque === "em-estoque" ? !temEstoque : temEstoque) return false;
      if (categoria && produto.categoria !== categoria) return false;
      if (!termo) return true;

      return [produto.nome, produto.codigoBarras, produto.codigoAuxiliar ?? ""].some((campo) =>
        normalizar(campo).includes(termo)
      );
    });
  }, [produtos, busca, filtroEstoque, categoria]);

  const quantidadePorProduto = useMemo(
    () => new Map(carrinho.map((item) => [item.produto.id, item.quantidade])),
    [carrinho]
  );
  const totalItensCarrinho = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const subtotal = calcularSubtotal(carrinho);
  const valorDescontoInformado =
    tipoDesconto === "percentual"
      ? Number(descontoPercentual.replace(",", ".")) || 0
      : campoDescontoValor.valor;
  const { desconto, excedeu: descontoExcedeu } = calcularDesconto(
    subtotal,
    tipoDesconto,
    valorDescontoInformado
  );
  const totalFinal = Math.max(0, subtotal - desconto);

  function handleAumentar(produto: Produto) {
    const atual = quantidadePorProduto.get(produto.id) ?? 0;

    setCarrinho((itens) =>
      atual === 0
        ? [...itens, { produto, quantidade: 1 }]
        : itens.map((item) =>
            item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
          )
    );
  }

  function handleDiminuir(produto: Produto) {
    setCarrinho((itens) =>
      itens
        .map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function handleRemover(produto: Produto) {
    setCarrinho((itens) => itens.filter((item) => item.produto.id !== produto.id));
    mostrarToast("Item removido do carrinho");
  }

  function handleAdicionarDaFicha(produto: Produto) {
    setProdutoFicha(null);
    handleAumentar(produto);
    mostrarToast(`${produto.nome} adicionado ao carrinho`);
  }

  function handleConfirmarCliente(novoCliente: Cliente | null) {
    setCliente(novoCliente);
    setModalClienteVisivel(false);
    mostrarToast(
      novoCliente ? "Cliente vinculado ao pedido" : "Consumidor mantido como não identificado"
    );
  }

  function handleTrocarTipoDesconto(tipo: TipoDesconto) {
    setTipoDesconto(tipo);
    setDescontoPercentual("");
    campoDescontoValor.redefinir(0);
  }

  async function handleEnviarAoCaixa() {
    if (carrinho.length === 0) {
      mostrarToast("Adicione pelo menos 1 produto ao carrinho");
      return;
    }

    setEnviando(true);

    try {
      const pedido = await criarPedido({
        itens: carrinho,
        cliente: cliente ?? { nome: NOME_CONSUMIDOR_PADRAO },
        desconto,
        formaPagamento,
        vendedor: NOME_USUARIO,
      });

      setCarrinho([]);
      setCliente(null);
      setDescontoPercentual("");
      campoDescontoValor.redefinir(0);
      setFormaPagamento("PIX");
      await carregarDados();
      setAbaAtiva("catalogo");
      mostrarToast(`Pedido ${pedido.numero} enviado ao caixa`);
    } catch {
      Alert.alert("Não foi possível gerar o pedido", "Verifique a conexão e tente novamente.");
      await carregarDados();
    } finally {
      setEnviando(false);
    }
  }

  const abas: {
    chave: AbaVenda;
    rotulo: string;
    icone: "bag-outline" | "cart-outline";
    contador: number;
  }[] = [
    { chave: "catalogo", rotulo: "Catálogo", icone: "bag-outline", contador: 0 },
    { chave: "carrinho", rotulo: "Carrinho", icone: "cart-outline", contador: totalItensCarrinho },
  ];

  function renderizarCatalogo() {
    return (
      <View style={styles.flex}>
        <View style={styles.filtros}>
          <View style={styles.campoBusca}>
            <Ionicons name="search" size={17} color={cores.textoTerciario} />
            <TextInput
              style={styles.inputBusca}
              value={busca}
              onChangeText={setBusca}
              placeholder="Nome, EAN ou código auxiliar..."
              placeholderTextColor={cores.textoTerciario}
              accessibilityLabel="Buscar produto para venda"
              autoCorrect={false}
              returnKeyType="search"
            />
            {busca.length > 0 ? (
              <TouchableOpacity
                style={styles.botaoLimpar}
                onPress={() => setBusca("")}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
              >
                <Ionicons name="close" size={16} color={cores.textoTerciario} />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.segmentado}>
              {(
                [
                  ["em-estoque", `Em estoque (${totalEmEstoque})`],
                  ["sem-estoque", `Sem estoque (${totalSemEstoque})`],
                ] as const
              ).map(([valor, rotulo]) => {
                const ativo = filtroEstoque === valor;

                return (
                  <TouchableOpacity
                    key={valor}
                    style={[styles.segmento, ativo ? styles.segmentoAtivo : undefined]}
                    onPress={() => setFiltroEstoque(valor)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                  >
                    <Text
                      style={[styles.segmentoTexto, ativo ? styles.segmentoTextoAtivo : undefined]}
                    >
                      {rotulo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.separadorVertical} />

            {[null, ...categorias].map((opcao) => {
              const ativo = categoria === opcao;

              return (
                <TouchableOpacity
                  key={opcao ?? "todas"}
                  style={[styles.chip, ativo ? styles.chipAtivo : undefined]}
                  onPress={() => setCategoria(opcao)}
                  accessibilityRole="button"
                  accessibilityLabel={`Categoria ${opcao ?? "todas"}`}
                  accessibilityState={{ selected: ativo }}
                >
                  <Text style={[styles.chipTexto, ativo ? styles.chipTextoAtivo : undefined]}>
                    {opcao ?? "Todas"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {carregando ? (
          <ActivityIndicator
            style={styles.carregando}
            size="large"
            color={cores.primaria}
            accessibilityLabel="Carregando catálogo"
          />
        ) : (
          <FlatList
            data={produtosFiltrados}
            keyExtractor={(produto) => produto.id}
            style={styles.flex}
            contentContainerStyle={[
              styles.lista,
              totalItensCarrinho > 0 ? styles.listaComBarra : undefined,
            ]}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <CardProdutoVenda
                produto={item}
                quantidadeNoCarrinho={quantidadePorProduto.get(item.id) ?? 0}
                aoAumentar={() => handleAumentar(item)}
                aoDiminuir={() => handleDiminuir(item)}
                aoAbrirFicha={() => setProdutoFicha(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.vazio}>
                <Ionicons name="search" size={26} color={cores.textoTerciario} />
                <Text style={styles.vazioTitulo}>Nenhum produto encontrado</Text>
                <Text style={styles.vazioTexto}>
                  Tente outro nome, EAN ou código auxiliar, ou limpe os filtros.
                </Text>
              </View>
            }
          />
        )}

        {totalItensCarrinho > 0 ? (
          <View style={styles.barraCarrinho}>
            <TouchableOpacity
              style={styles.barraCarrinhoResumo}
              onPress={() => setAbaAtiva("carrinho")}
              accessibilityRole="button"
              accessibilityLabel="Revisar carrinho"
            >
              <View style={styles.barraCarrinhoIcone}>
                <Ionicons name="cart" size={17} color={cores.textoSobreCor} />
                <View style={styles.barraCarrinhoContador}>
                  <Text style={styles.barraCarrinhoContadorTexto}>{totalItensCarrinho}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.barraCarrinhoTotal}>{formatarMoeda(totalFinal)}</Text>
                <Text style={styles.barraCarrinhoDica}>Toque para revisar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.barraCarrinhoBotao}
              onPress={() => setAbaAtiva("carrinho")}
              accessibilityRole="button"
              accessibilityLabel="Revisar pedido"
            >
              <Text style={styles.barraCarrinhoBotaoTexto}>Revisar pedido</Text>
              <Ionicons name="chevron-forward" size={15} color={cores.textoSobreCor} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }

  function renderizarCarrinho() {
    return (
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.secaoTopo}>
          <View style={styles.flex}>
            <Text style={styles.tituloSecao}>Carrinho do pedido</Text>
            <Text style={styles.subtituloSecao}>Conferência dos itens antes do envio ao caixa</Text>
          </View>
          <TouchableOpacity
            style={styles.botaoSuave}
            onPress={() => setAbaAtiva("catalogo")}
            accessibilityRole="button"
            accessibilityLabel="Adicionar mais itens"
          >
            <Ionicons name="add" size={15} color={cores.primaria} />
            <Text style={styles.botaoSuaveTexto}>Itens</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.cartao, styles.cartaoLinha]}>
          <View style={styles.iconeCliente}>
            <Ionicons name="person-outline" size={16} color={cores.textoSecundario} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.rotuloPequeno}>Comprador</Text>
            <Text style={styles.textoForte}>{cliente?.nome ?? NOME_CONSUMIDOR_PADRAO}</Text>
            {cliente?.cpf ? (
              <Text style={styles.textoMono}>CPF: {formatarCpf(cliente.cpf)}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => setModalClienteVisivel(true)}
            accessibilityRole="button"
            accessibilityLabel="Alterar comprador"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.link}>Alterar</Text>
          </TouchableOpacity>
        </View>

        {carrinho.length === 0 ? (
          <View style={[styles.cartao, styles.vazio]}>
            <Ionicons name="cart-outline" size={28} color={cores.textoTerciario} />
            <Text style={styles.vazioTitulo}>Carrinho vazio</Text>
            <Text style={styles.vazioTexto}>Adicione produtos pelo catálogo.</Text>
            <CustomButton
              titulo="Abrir catálogo"
              onPress={() => setAbaAtiva("catalogo")}
              compacto
              estiloContainer={styles.botaoVazio}
            />
          </View>
        ) : (
          carrinho.map((item) => (
            <View key={item.produto.id} style={[styles.cartao, styles.itemCarrinho]}>
              <Text style={styles.itemCarrinhoIcone}>{item.produto.categoriaIcone ?? "📦"}</Text>
              <View style={styles.flex}>
                <Text style={styles.textoForte} numberOfLines={1}>
                  {item.produto.nome}
                </Text>
                <Text style={styles.textoMono}>{formatarMoeda(item.produto.preco)} un.</Text>
                {item.quantidade > item.produto.quantidade ? (
                  <Text style={styles.avisoEstoque}>
                    Estoque ficará em {item.produto.quantidade - item.quantidade} un.
                  </Text>
                ) : null}
                <TouchableOpacity
                  onPress={() => handleRemover(item.produto)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover ${item.produto.nome} do carrinho`}
                  hitSlop={{ top: 8, bottom: 8 }}
                >
                  <Text style={styles.linkPerigo}>Remover</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemCarrinhoDireita}>
                <SeletorQuantidade
                  quantidade={item.quantidade}
                  aoAumentar={() => handleAumentar(item.produto)}
                  aoDiminuir={() => handleDiminuir(item.produto)}
                  compacto
                />
                <Text style={styles.itemCarrinhoTotal}>
                  {formatarMoeda(item.produto.preco * item.quantidade)}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.cartao}>
          <View style={styles.cartaoCabecalho}>
            <Text style={styles.textoForte}>
              Desconto geral{" "}
              <Text style={styles.textoSuave}>(máx. {DESCONTO_MAXIMO_PERCENTUAL}%)</Text>
            </Text>
            <View style={styles.segmentadoPequeno}>
              {(
                [
                  ["percentual", "%"],
                  ["valor", "R$"],
                ] as const
              ).map(([valor, rotulo]) => {
                const ativo = tipoDesconto === valor;

                return (
                  <TouchableOpacity
                    key={valor}
                    style={[styles.segmentoPequeno, ativo ? styles.segmentoAtivo : undefined]}
                    onPress={() => handleTrocarTipoDesconto(valor)}
                    accessibilityRole="button"
                    accessibilityLabel={`Desconto em ${valor === "percentual" ? "porcentagem" : "reais"}`}
                    accessibilityState={{ selected: ativo }}
                  >
                    <Text
                      style={[styles.segmentoTexto, ativo ? styles.segmentoTextoAtivo : undefined]}
                    >
                      {rotulo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={[styles.campoDesconto, descontoExcedeu ? styles.campoDescontoErro : undefined]}
          >
            {tipoDesconto === "percentual" ? (
              <TextInput
                style={styles.inputDesconto}
                value={descontoPercentual}
                onChangeText={(texto) => setDescontoPercentual(texto.replace(/[^\d,.]/g, ""))}
                placeholder="0"
                placeholderTextColor={cores.textoTerciario}
                keyboardType="decimal-pad"
                accessibilityLabel="Desconto em porcentagem"
              />
            ) : (
              <TextInput
                style={styles.inputDesconto}
                value={campoDescontoValor.texto}
                onChangeText={campoDescontoValor.aoMudarTexto}
                selection={campoDescontoValor.selecao}
                onSelectionChange={campoDescontoValor.aoFocar}
                onFocus={campoDescontoValor.aoFocar}
                keyboardType="numeric"
                accessibilityLabel="Desconto em reais"
              />
            )}
            <Text style={styles.unidadeDesconto}>{tipoDesconto === "percentual" ? "%" : "R$"}</Text>
          </View>

          {descontoExcedeu ? (
            <View style={styles.aviso}>
              <Ionicons name="alert-circle-outline" size={16} color={cores.perigo} />
              <Text style={styles.avisoTexto}>
                Regra da loja: o desconto máximo por pedido é de {DESCONTO_MAXIMO_PERCENTUAL}%.
                Aplicado: {formatarMoeda(desconto)}.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cartao}>
          <Text style={styles.textoForte}>Forma prevista de pagamento</Text>
          <View style={styles.gradePagamento}>
            {FORMAS_PAGAMENTO.map((opcao) => {
              const ativo = formaPagamento === opcao.valor;

              return (
                <TouchableOpacity
                  key={opcao.valor}
                  style={[styles.opcaoPagamento, ativo ? styles.opcaoPagamentoAtiva : undefined]}
                  onPress={() => setFormaPagamento(opcao.valor)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativo }}
                  accessibilityLabel={opcao.rotulo}
                >
                  <Text style={styles.opcaoPagamentoIcone}>{opcao.icone}</Text>
                  <Text
                    style={[
                      styles.opcaoPagamentoTexto,
                      ativo ? styles.opcaoPagamentoTextoAtiva : undefined,
                    ]}
                  >
                    {opcao.rotulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.totais}>
            <View style={styles.totalLinha}>
              <Text style={styles.totalRotulo}>Subtotal dos itens</Text>
              <Text style={styles.totalValor}>{formatarMoeda(subtotal)}</Text>
            </View>
            <View style={styles.totalLinha}>
              <Text style={styles.totalRotulo}>Desconto concedido</Text>
              <Text style={[styles.totalValor, styles.totalDesconto]}>
                - {formatarMoeda(desconto)}
              </Text>
            </View>
            <View style={[styles.totalLinha, styles.totalFinalLinha]}>
              <Text style={styles.totalFinalRotulo}>Total a pagar</Text>
              <Text style={styles.totalFinalValor}>{formatarMoeda(totalFinal)}</Text>
            </View>
          </View>
        </View>

        <CustomButton
          titulo="Gerar pedido e enviar ao caixa"
          onPress={handleEnviarAoCaixa}
          carregando={enviando}
          desabilitado={carrinho.length === 0}
          icone="checkmark"
        />
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecalho}>
        <View style={styles.linhaCabecalho}>
          <View style={styles.vendedor}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{NOME_USUARIO[0]}</Text>
              <View style={styles.indicadorOnline} />
            </View>
            <View>
              <View style={styles.vendedorLinha}>
                <Text style={styles.vendedorNome}>{NOME_USUARIO}</Text>
                <View style={styles.seloBalcao}>
                  <Text style={styles.seloBalcaoTexto}>Balcão</Text>
                </View>
              </View>
              <Text style={styles.vendedorTerminal}>{TERMINAL_VENDA}</Text>
            </View>
          </View>

          <View style={styles.acoesCabecalho}>
            <TouchableOpacity
              style={styles.botaoCliente}
              onPress={() => setModalClienteVisivel(true)}
              accessibilityRole="button"
              accessibilityLabel={`Comprador: ${cliente?.nome ?? "não identificado"}. Toque para alterar`}
            >
              <Ionicons name="person-outline" size={14} color={cores.textoSecundario} />
              <Text style={styles.botaoClienteTexto} numberOfLines={1}>
                {cliente ? cliente.nome.split(" ")[0] : "Consumidor"}
              </Text>
              <View style={[styles.pontoCliente, cliente ? styles.pontoClienteAtivo : undefined]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoMenu}
              onPress={() => setMenuAberto(true)}
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
            >
              <Ionicons name="menu" size={18} color={cores.textoSecundario} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.abas} accessibilityRole="tablist">
          {abas.map((aba) => {
            const ativa = aba.chave === abaAtiva;

            return (
              <TouchableOpacity
                key={aba.chave}
                style={[styles.aba, ativa ? styles.abaAtiva : undefined]}
                onPress={() => setAbaAtiva(aba.chave)}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativa }}
                accessibilityLabel={
                  aba.contador > 0 ? `${aba.rotulo} (${aba.contador})` : aba.rotulo
                }
              >
                <Ionicons
                  name={aba.icone}
                  size={15}
                  color={ativa ? cores.primaria : cores.textoSecundario}
                />
                <Text style={[styles.abaTexto, ativa ? styles.abaTextoAtiva : undefined]}>
                  {aba.rotulo}
                </Text>
                {aba.contador > 0 ? (
                  <View style={styles.abaContador}>
                    <Text style={styles.abaContadorTexto}>{aba.contador}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {abaAtiva === "catalogo" ? renderizarCatalogo() : null}
      {abaAtiva === "carrinho" ? renderizarCarrinho() : null}

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        nomeUsuario={NOME_USUARIO}
        emailUsuario={usuario?.email ?? ""}
        cargoUsuario="Vendedor · balcão"
        telaAtiva="vendas"
        pedidosPendentes={pedidosPendentes}
        aoSair={() => {
          setMenuAberto(false);
          logout();
        }}
      />

      <ModalFichaProduto
        produto={produtoFicha}
        aoFechar={() => setProdutoFicha(null)}
        aoAdicionar={handleAdicionarDaFicha}
      />

      {modalClienteVisivel ? (
        <ModalCliente
          visivel
          clienteAtual={cliente}
          aoFechar={() => setModalClienteVisivel(false)}
          aoConfirmar={handleConfirmarCliente}
        />
      ) : null}
    </SafeAreaView>
  );
}
