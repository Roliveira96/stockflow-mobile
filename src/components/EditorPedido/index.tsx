import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FormularioCliente } from "@/components/FormularioCliente";
import { SeletorQuantidade } from "@/components/SeletorQuantidade";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { useCampoMoeda } from "@/hooks/useCampoMoeda";
import { editarPedido, listarProdutosVendaveis } from "@/services/vendas";
import type {
  Cliente,
  EditorPedidoProps,
  FormaPagamento,
  ItemBalcao,
  ItemRascunho,
  Produto,
  TipoDesconto,
} from "@/types";
import { formatarMoeda } from "@/utils/moeda";
import { normalizarTexto } from "@/utils/texto";
import {
  calcularDesconto,
  DESCONTO_MAXIMO_PERCENTUAL,
  formatarCpf,
  formatarTelefone,
  FORMAS_PAGAMENTO,
  ITENS_BALCAO,
  NOME_CONSUMIDOR_PADRAO,
} from "@/utils/venda";

import { criarEstilos } from "./styles";

const LIMITE_OBSERVACAO = 300;

type Submodo = "cliente" | "produto" | null;

export function EditorPedido({ pedido, operador, aoSalvar, aoDescartar }: EditorPedidoProps) {
  const { cores } = useTema();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [itens, setItens] = useState<ItemRascunho[]>(() =>
    pedido.itens.map(({ produtoId, nome, icone, precoUnitario, quantidade }) => ({
      produtoId,
      nome,
      icone,
      precoUnitario,
      quantidade,
    }))
  );
  const [itensBalcao, setItensBalcao] = useState<ItemBalcao[]>(pedido.itensBalcao);
  const [cliente, setCliente] = useState<Cliente>(pedido.cliente);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(pedido.formaPagamento);
  const [tipoDesconto, setTipoDesconto] = useState<TipoDesconto>("valor");
  const [descontoPercentual, setDescontoPercentual] = useState("");
  const campoDescontoValor = useCampoMoeda(pedido.desconto);
  const [observacao, setObservacao] = useState(pedido.observacao ?? "");
  const [submodo, setSubmodo] = useState<Submodo>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarProdutosVendaveis()
      .then(setProdutos)
      .catch(() => setProdutos([]))
      .finally(() => setCarregandoProdutos(false));
  }, []);

  const quantidadeOriginal = useMemo(
    () => new Map(pedido.itens.map((item) => [item.produtoId, item.quantidade])),
    [pedido.itens]
  );
  const produtoPorId = useMemo(
    () => new Map(produtos.map((produto) => [produto.id, produto])),
    [produtos]
  );

  const subtotal =
    itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0) +
    itensBalcao.reduce((soma, item) => soma + item.preco, 0);
  const valorDescontoInformado =
    tipoDesconto === "percentual"
      ? Number(descontoPercentual.replace(",", ".")) || 0
      : campoDescontoValor.valor;
  const { desconto, excedeu } = calcularDesconto(subtotal, tipoDesconto, valorDescontoInformado);
  const total = Math.max(0, subtotal - desconto);

  const produtosEncontrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    if (!termo) return produtos.slice(0, 20);

    return produtos
      .filter((produto) =>
        [produto.nome, produto.codigoBarras, produto.codigoAuxiliar ?? ""].some((campo) =>
          normalizarTexto(campo).includes(termo)
        )
      )
      .slice(0, 20);
  }, [produtos, busca]);

  function estoqueAposEdicao(item: ItemRascunho) {
    const produto = produtoPorId.get(item.produtoId);
    if (!produto) return null;

    const diferenca = item.quantidade - (quantidadeOriginal.get(item.produtoId) ?? 0);
    return produto.quantidade - diferenca;
  }

  function alterarQuantidade(produtoId: string, variacao: number) {
    setItens((atual) =>
      atual
        .map((item) =>
          item.produtoId === produtoId ? { ...item, quantidade: item.quantidade + variacao } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function removerItem(produtoId: string) {
    setItens((atual) => atual.filter((item) => item.produtoId !== produtoId));
  }

  function adicionarProduto(produto: Produto) {
    setItens((atual) =>
      atual.some((item) => item.produtoId === produto.id)
        ? atual.map((item) =>
            item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
          )
        : [
            ...atual,
            {
              produtoId: produto.id,
              nome: produto.nome,
              icone: produto.categoriaIcone ?? "📦",
              precoUnitario: produto.preco,
              quantidade: 1,
            },
          ]
    );
    mostrarToast(`${produto.nome} adicionado`);
  }

  function trocarTipoDesconto(tipo: TipoDesconto) {
    setTipoDesconto(tipo);
    setDescontoPercentual("");
    campoDescontoValor.redefinir(0);
  }

  async function handleSalvar() {
    if (itens.length === 0) {
      Alert.alert(
        "Pedido sem itens",
        "Para remover todos os itens, cancele o pedido informando o motivo."
      );
      return;
    }

    setSalvando(true);

    try {
      const atualizado = await editarPedido(
        pedido,
        {
          itens,
          itensBalcao,
          cliente,
          formaPagamento,
          desconto,
          observacao: observacao.trim(),
        },
        operador
      );
      mostrarToast(`Pedido ${pedido.numero} atualizado`);
      aoSalvar(atualizado);
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível salvar as alterações do pedido.");
    } finally {
      setSalvando(false);
    }
  }

  if (submodo === "cliente") {
    return (
      <View style={styles.container}>
        <Text style={styles.tituloSubmodo}>Identificar cliente / CPF na nota</Text>
        <FormularioCliente
          clienteAtual={cliente.nome === NOME_CONSUMIDOR_PADRAO && !cliente.cpf ? null : cliente}
          aoConfirmar={(novo) => {
            setCliente(novo ?? { nome: NOME_CONSUMIDOR_PADRAO });
            setSubmodo(null);
          }}
          aoCancelar={() => setSubmodo(null)}
        />
      </View>
    );
  }

  if (submodo === "produto") {
    return (
      <View style={styles.container}>
        <View style={styles.cabecalhoSubmodo}>
          <Text style={styles.tituloSubmodo}>Adicionar produto ao pedido</Text>
          <TouchableOpacity
            onPress={() => {
              setSubmodo(null);
              setBusca("");
            }}
            accessibilityRole="button"
            accessibilityLabel="Concluir adição de produtos"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.link}>Concluir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.campoBusca}>
          <Ionicons name="search" size={16} color={cores.textoTerciario} />
          <TextInput
            style={styles.inputBusca}
            value={busca}
            onChangeText={setBusca}
            placeholder="Nome, EAN ou código auxiliar"
            placeholderTextColor={cores.textoTerciario}
            accessibilityLabel="Buscar produto para adicionar"
            autoCorrect={false}
          />
        </View>

        {carregandoProdutos ? (
          <ActivityIndicator color={cores.primaria} accessibilityLabel="Carregando produtos" />
        ) : produtosEncontrados.length === 0 ? (
          <Text style={styles.textoAjuda}>Nenhum produto encontrado.</Text>
        ) : (
          produtosEncontrados.map((produto) => {
            const noPedido = itens.find((item) => item.produtoId === produto.id)?.quantidade ?? 0;

            return (
              <TouchableOpacity
                key={produto.id}
                style={styles.resultado}
                onPress={() => adicionarProduto(produto)}
                accessibilityRole="button"
                accessibilityLabel={`Adicionar ${produto.nome}`}
              >
                <Text style={styles.itemIcone}>{produto.categoriaIcone ?? "📦"}</Text>
                <View style={styles.flex}>
                  <Text style={styles.itemNome} numberOfLines={1}>
                    {produto.nome}
                  </Text>
                  <Text
                    style={[
                      styles.itemDetalhe,
                      produto.quantidade <= 0 ? styles.textoPerigo : undefined,
                    ]}
                  >
                    {produto.codigoAuxiliar ? `${produto.codigoAuxiliar} · ` : ""}
                    {produto.quantidade} em estoque · {formatarMoeda(produto.preco)}
                  </Text>
                </View>
                {noPedido > 0 ? (
                  <View style={styles.contadorNoPedido}>
                    <Text style={styles.contadorNoPedidoTexto}>{noPedido}</Text>
                  </View>
                ) : null}
                <Ionicons name="add-circle" size={22} color={cores.primaria} />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.faixaEdicao}>
        <Ionicons name="create-outline" size={16} color={cores.primaria} />
        <Text style={styles.faixaEdicaoTexto}>
          Editando o pedido. O estoque só é ajustado ao salvar.
        </Text>
      </View>

      <View style={styles.cartao}>
        <View style={styles.linhaCabecalho}>
          <Text style={styles.rotuloSecao}>Cliente</Text>
          <TouchableOpacity
            onPress={() => setSubmodo("cliente")}
            accessibilityRole="button"
            accessibilityLabel="Identificar ou alterar cliente"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.link}>{cliente.cpf ? "Alterar" : "Identificar / CPF"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemNome}>{cliente.nome}</Text>
        <Text style={styles.itemDetalhe}>
          {cliente.cpf ? `CPF: ${formatarCpf(cliente.cpf)}` : "Sem CPF na nota"}
          {cliente.telefone ? ` · ${formatarTelefone(cliente.telefone)}` : ""}
        </Text>
      </View>

      <View style={styles.cartao}>
        <View style={styles.linhaCabecalho}>
          <Text style={styles.rotuloSecao}>Itens</Text>
          <TouchableOpacity
            style={styles.botaoSuave}
            onPress={() => setSubmodo("produto")}
            accessibilityRole="button"
            accessibilityLabel="Adicionar produto"
          >
            <Ionicons name="add" size={15} color={cores.primaria} />
            <Text style={styles.botaoSuaveTexto}>Produto</Text>
          </TouchableOpacity>
        </View>

        {itens.length === 0 ? (
          <Text style={[styles.textoAjuda, styles.textoPerigo]}>
            Pedido sem itens. Adicione um produto ou cancele o pedido.
          </Text>
        ) : (
          itens.map((item) => {
            const estoqueFinal = estoqueAposEdicao(item);
            const original = quantidadeOriginal.get(item.produtoId);

            return (
              <View key={item.produtoId} style={styles.item}>
                <Text style={styles.itemIcone}>{item.icone}</Text>
                <View style={styles.flex}>
                  <Text style={styles.itemNome} numberOfLines={1}>
                    {item.nome}
                  </Text>
                  <Text style={styles.itemDetalhe}>
                    {formatarMoeda(item.precoUnitario)} un.
                    {original === undefined
                      ? " · novo"
                      : original !== item.quantidade
                        ? ` · era ${original}`
                        : ""}
                  </Text>
                  {estoqueFinal !== null && estoqueFinal < 0 ? (
                    <Text style={styles.avisoEstoque}>Estoque ficará em {estoqueFinal} un.</Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => removerItem(item.produtoId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${item.nome} do pedido`}
                    hitSlop={{ top: 8, bottom: 8 }}
                  >
                    <Text style={styles.linkPerigo}>Remover</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.itemDireita}>
                  <SeletorQuantidade
                    quantidade={item.quantidade}
                    aoAumentar={() => alterarQuantidade(item.produtoId, 1)}
                    aoDiminuir={() => alterarQuantidade(item.produtoId, -1)}
                    compacto
                  />
                  <Text style={styles.itemTotal}>
                    {formatarMoeda(item.precoUnitario * item.quantidade)}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        {itensBalcao.map((item, indice) => (
          <View key={`balcao-${indice}`} style={[styles.item, styles.itemBalcao]}>
            <Ionicons name="gift-outline" size={17} color={cores.primaria} />
            <Text style={[styles.itemNome, styles.flex]}>{item.nome}</Text>
            <Text style={styles.itemTotal}>{formatarMoeda(item.preco)}</Text>
            <TouchableOpacity
              onPress={() =>
                setItensBalcao((atual) => atual.filter((_, posicao) => posicao !== indice))
              }
              accessibilityRole="button"
              accessibilityLabel={`Remover ${item.nome}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color={cores.perigo} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.opcoesBalcao}>
          {ITENS_BALCAO.map((item) => (
            <TouchableOpacity
              key={item.nome}
              style={styles.opcaoBalcao}
              onPress={() =>
                setItensBalcao((atual) => [...atual, { nome: item.nome, preco: item.preco }])
              }
              accessibilityRole="button"
              accessibilityLabel={`Adicionar ${item.nome}`}
            >
              <Text style={styles.opcaoBalcaoTexto}>
                + {item.icone} {item.nome} ({formatarMoeda(item.preco)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.rotuloSecao}>Forma de pagamento</Text>
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
                <Text>{opcao.icone}</Text>
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
      </View>

      <View style={styles.cartao}>
        <View style={styles.linhaCabecalho}>
          <Text style={styles.rotuloSecao}>
            Desconto <Text style={styles.textoSuave}>(máx. {DESCONTO_MAXIMO_PERCENTUAL}%)</Text>
          </Text>
          <View style={styles.segmentado}>
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
                  style={[styles.segmento, ativo ? styles.segmentoAtivo : undefined]}
                  onPress={() => trocarTipoDesconto(valor)}
                  accessibilityRole="button"
                  accessibilityLabel={`Desconto do caixa em ${valor === "percentual" ? "porcentagem" : "reais"}`}
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
        <Text style={styles.textoAjuda}>Dado pelo vendedor: {formatarMoeda(pedido.desconto)}</Text>
        <View style={[styles.campoDesconto, excedeu ? styles.campoDescontoErro : undefined]}>
          {tipoDesconto === "percentual" ? (
            <TextInput
              style={styles.inputDesconto}
              value={descontoPercentual}
              onChangeText={(texto) => setDescontoPercentual(texto.replace(/[^\d,.]/g, ""))}
              placeholder="0"
              placeholderTextColor={cores.textoTerciario}
              keyboardType="decimal-pad"
              accessibilityLabel="Desconto do caixa em porcentagem"
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
              accessibilityLabel="Desconto do caixa em reais"
            />
          )}
          <Text style={styles.unidade}>{tipoDesconto === "percentual" ? "%" : "R$"}</Text>
        </View>
        {excedeu ? (
          <Text style={styles.avisoPerigo}>
            Acima do limite de {DESCONTO_MAXIMO_PERCENTUAL}%. Aplicado: {formatarMoeda(desconto)}.
          </Text>
        ) : null}
      </View>

      <View style={styles.cartao}>
        <View style={styles.linhaCabecalho}>
          <Text style={styles.rotuloSecao}>Observação</Text>
          <Text style={styles.contador}>
            {observacao.length}/{LIMITE_OBSERVACAO}
          </Text>
        </View>
        <TextInput
          style={styles.inputObservacao}
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Ex: cliente volta às 15h para retirar; troco para R$ 100"
          placeholderTextColor={cores.textoTerciario}
          multiline
          maxLength={LIMITE_OBSERVACAO}
          accessibilityLabel="Observação do pedido"
        />
      </View>

      <View style={styles.totais}>
        <View style={styles.totalLinha}>
          <Text style={styles.totalRotulo}>Subtotal</Text>
          <Text style={styles.totalValor}>{formatarMoeda(subtotal)}</Text>
        </View>
        <View style={styles.totalLinha}>
          <Text style={styles.totalRotulo}>Desconto</Text>
          <Text style={[styles.totalValor, styles.textoPerigo]}>- {formatarMoeda(desconto)}</Text>
        </View>
        <View style={[styles.totalLinha, styles.totalFinalLinha]}>
          <Text style={styles.totalFinalRotulo}>Novo total</Text>
          <Text style={styles.totalFinalValor}>{formatarMoeda(total)}</Text>
        </View>
      </View>

      <View style={styles.acoes}>
        <CustomButton
          titulo="Descartar"
          onPress={aoDescartar}
          variante="neutro"
          compacto
          estiloContainer={styles.botaoSecundario}
        />
        <CustomButton
          titulo="Salvar alterações"
          onPress={handleSalvar}
          carregando={salvando}
          desabilitado={itens.length === 0}
          icone="checkmark"
          compacto
          estiloContainer={styles.botaoPrincipal}
        />
      </View>
    </View>
  );
}
