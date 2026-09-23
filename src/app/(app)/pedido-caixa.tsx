import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BarraTopo } from "@/components/BarraTopo";
import { CustomButton } from "@/components/CustomButton";
import { EditorPedido } from "@/components/EditorPedido";
import { PagamentoPix } from "@/components/PagamentoPix";
import { NOME_USUARIO } from "@/constants/usuario";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { api } from "@/services/api";
import { gerarComprovante } from "@/services/comprovante";
import {
  atualizarPedido,
  cancelarPedido,
  confirmarPagamento,
  reabrirPedido,
} from "@/services/vendas";
import { criarEstilos } from "@/styles/pedido-caixa.styles";
import type { ItemBalcao, Pedido, TipoEventoPedido } from "@/types";
import { formatarData } from "@/utils/data";
import { formatarMoeda } from "@/utils/moeda";
import {
  formatarCpf,
  formatarTelefone,
  ITENS_BALCAO,
  MOTIVOS_CANCELAMENTO,
  rotuloFormaPagamento,
} from "@/utils/venda";

const MOTIVO_OUTRO = "Outro motivo";

const ROTULO_EVENTO: Record<TipoEventoPedido, string> = {
  criado: "Pedido criado",
  pago: "Pagamento confirmado",
  cancelado: "Pedido cancelado",
  reaberto: "Pedido reaberto",
  editado: "Pedido editado",
};

export default function PedidoCaixa() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const { cores } = useTema();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [salvando, setSalvando] = useState(false);
  const [gerandoComprovante, setGerandoComprovante] = useState(false);
  const [pixGeradoPara, setPixGeradoPara] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [motivoSelecionado, setMotivoSelecionado] = useState<string | null>(null);
  const [motivoLivre, setMotivoLivre] = useState("");

  const carregarPedido = useCallback(async () => {
    try {
      const resposta = await api.get<Pedido>(`/pedidos/${id}`);
      setPedido(resposta.data);
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível carregar o pedido.");
      router.back();
    }
  }, [id, router]);

  useFocusEffect(
    useCallback(() => {
      carregarPedido();
    }, [carregarPedido])
  );

  async function handleGerarComprovante(alvo: Pedido) {
    setGerandoComprovante(true);

    try {
      await gerarComprovante(alvo);
    } catch {
      Alert.alert("Comprovante", "Não foi possível gerar o comprovante em PDF.");
    } finally {
      setGerandoComprovante(false);
    }
  }

  function aoAtualizar(atualizado: Pedido) {
    const statusAnterior = pedido?.status;
    setPedido(atualizado);

    if (atualizado.status === statusAnterior) return;

    if (atualizado.status === "CANCELADO") {
      router.back();
    } else if (atualizado.status === "PAGO") {
      handleGerarComprovante(atualizado);
    }
  }

  const status = pedido?.status;
  const aguardando = status === "AGUARDANDO";
  const embalados = pedido?.itens.filter((item) => item.embalado).length ?? 0;
  const cobrancaPixAtual = pedido ? `${pedido.id}:${pedido.total.toFixed(2)}` : null;
  const pixGerado = cobrancaPixAtual !== null && pixGeradoPara === cobrancaPixAtual;
  const aguardandoPix = pedido?.formaPagamento === "PIX" && !pixGerado;
  const handleGerarPix = useCallback(() => {
    setPixGeradoPara(cobrancaPixAtual);
  }, [cobrancaPixAtual]);
  const motivoFinal =
    motivoSelecionado === MOTIVO_OUTRO ? motivoLivre.trim() : (motivoSelecionado ?? "");

  function limparCancelamento() {
    setCancelando(false);
    setMotivoSelecionado(null);
    setMotivoLivre("");
  }

  function handleVoltar() {
    if (editando) {
      setEditando(false);
      return;
    }

    if (cancelando) {
      limparCancelamento();
      return;
    }

    router.back();
  }

  async function executar(acao: () => Promise<Pedido>, mensagem?: string) {
    setSalvando(true);

    try {
      const atualizado = await acao();
      limparCancelamento();
      aoAtualizar(atualizado);
      if (mensagem) mostrarToast(mensagem);
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível atualizar o pedido.");
    } finally {
      setSalvando(false);
    }
  }

  function handleAlternarEmbalado(indice: number) {
    if (!pedido || !aguardando) return;

    executar(() =>
      atualizarPedido(pedido.id, {
        itens: pedido.itens.map((item, atual) =>
          atual === indice ? { ...item, embalado: !item.embalado } : item
        ),
      })
    );
  }

  function handleAdicionarBalcao(item: ItemBalcao) {
    if (!pedido || !aguardando) return;

    executar(
      () =>
        atualizarPedido(pedido.id, {
          itensBalcao: [...pedido.itensBalcao, { nome: item.nome, preco: item.preco }],
          subtotal: pedido.subtotal + item.preco,
          total: pedido.total + item.preco,
        }),
      `${item.nome} adicionado ao pedido`
    );
  }

  function renderizarTitulo() {
    if (!pedido) return null;

    const estiloSelo =
      status === "PAGO"
        ? styles.seloPago
        : status === "CANCELADO"
          ? styles.seloCancelado
          : styles.seloAguardando;
    const estiloTexto =
      status === "PAGO"
        ? styles.seloTextoPago
        : status === "CANCELADO"
          ? styles.seloTextoCancelado
          : styles.seloTextoAguardando;
    const rotulo =
      status === "PAGO" ? "✓ Pago" : status === "CANCELADO" ? "Cancelado" : "Aguardando pagamento";

    return (
      <View style={styles.titulo}>
        <Text style={styles.numero}>{pedido.numero}</Text>
        <View style={[styles.selo, estiloSelo]}>
          <Text style={[styles.seloTexto, estiloTexto]}>{rotulo}</Text>
        </View>
      </View>
    );
  }

  function renderizarRodape() {
    if (!pedido || editando) return undefined;

    if (cancelando) {
      return (
        <>
          <CustomButton
            titulo="Voltar"
            onPress={limparCancelamento}
            variante="neutro"
            compacto
            estiloContainer={styles.botaoSecundario}
          />
          <CustomButton
            titulo="Confirmar cancelamento"
            onPress={() =>
              executar(
                () => cancelarPedido(pedido, motivoFinal, NOME_USUARIO),
                `Pedido ${pedido.numero} cancelado e estoque devolvido`
              )
            }
            carregando={salvando}
            desabilitado={motivoFinal.length === 0}
            variante="perigo"
            compacto
            estiloContainer={styles.botaoPrincipal}
          />
        </>
      );
    }

    if (status === "AGUARDANDO") {
      return (
        <>
          <CustomButton
            titulo="Cancelar"
            onPress={() => setCancelando(true)}
            variante="perigo"
            compacto
            estiloContainer={styles.botaoSecundario}
          />
          <CustomButton
            titulo="Editar"
            onPress={() => setEditando(true)}
            variante="neutro"
            icone="create-outline"
            compacto
            estiloContainer={styles.botaoSecundario}
          />
          <CustomButton
            titulo="Receber"
            onPress={() =>
              executar(
                () => confirmarPagamento(pedido, NOME_USUARIO),
                `Venda ${pedido.numero} paga e concluída`
              )
            }
            carregando={salvando}
            desabilitado={aguardandoPix}
            icone="checkmark"
            variante="sucesso"
            compacto
            estiloContainer={styles.botaoPrincipal}
          />
        </>
      );
    }

    if (status === "CANCELADO") {
      return (
        <CustomButton
          titulo="Reabrir pedido"
          onPress={() =>
            executar(
              () => reabrirPedido(pedido, NOME_USUARIO),
              `Pedido ${pedido.numero} reaberto e estoque baixado novamente`
            )
          }
          carregando={salvando}
          icone="refresh"
          compacto
          estiloContainer={styles.botaoPrincipal}
        />
      );
    }

    if (status === "PAGO") {
      return (
        <CustomButton
          titulo="Comprovante (PDF)"
          onPress={() => handleGerarComprovante(pedido)}
          carregando={gerandoComprovante}
          icone="document-text-outline"
          compacto
          estiloContainer={styles.botaoPrincipal}
        />
      );
    }

    return undefined;
  }

  if (!pedido) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator
          style={styles.carregando}
          size="large"
          color={cores.primaria}
          accessibilityLabel="Carregando pedido"
        />
      </SafeAreaView>
    );
  }

  const rodape = renderizarRodape();

  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraTopo
        rotuloVoltar={
          editando ? "Sair da edição" : cancelando ? "Voltar ao pedido" : "Voltar ao caixa"
        }
        aoVoltar={handleVoltar}
      />

      <View style={styles.cabecalho}>
        {renderizarTitulo()}
        <Text style={styles.subtitulo}>
          Criado em {formatarData(pedido.criadoEm)} · vendedor {pedido.vendedor}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          {pedido && cancelando ? (
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Por que o pedido será cancelado?</Text>
              <Text style={styles.textoAjuda}>
                O estoque dos {pedido.itens.length} ite{pedido.itens.length === 1 ? "m" : "ns"}{" "}
                volta para os lotes de origem. O pedido pode ser reaberto depois.
              </Text>
              {[...MOTIVOS_CANCELAMENTO, MOTIVO_OUTRO].map((motivo) => {
                const selecionado = motivoSelecionado === motivo;

                return (
                  <TouchableOpacity
                    key={motivo}
                    style={[styles.opcaoMotivo, selecionado ? styles.opcaoMotivoAtiva : undefined]}
                    onPress={() => setMotivoSelecionado(motivo)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selecionado }}
                    accessibilityLabel={motivo}
                  >
                    <Ionicons
                      name={selecionado ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={selecionado ? cores.perigo : cores.textoTerciario}
                    />
                    <Text
                      style={[
                        styles.opcaoMotivoTexto,
                        selecionado ? styles.opcaoMotivoTextoAtiva : undefined,
                      ]}
                    >
                      {motivo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {motivoSelecionado === MOTIVO_OUTRO ? (
                <TextInput
                  style={styles.inputMotivo}
                  value={motivoLivre}
                  onChangeText={setMotivoLivre}
                  placeholder="Descreva o motivo do cancelamento"
                  placeholderTextColor={cores.textoTerciario}
                  multiline
                  maxLength={200}
                  accessibilityLabel="Descreva o motivo do cancelamento"
                />
              ) : null}
            </View>
          ) : null}

          {pedido && editando ? (
            <EditorPedido
              pedido={pedido}
              operador={NOME_USUARIO}
              aoSalvar={(atualizado) => {
                setEditando(false);
                aoAtualizar(atualizado);
              }}
              aoDescartar={() => setEditando(false)}
            />
          ) : null}

          {pedido && !cancelando && !editando ? (
            <>
              {status === "CANCELADO" && pedido.motivoCancelamento ? (
                <View style={styles.avisoCancelado}>
                  <Ionicons name="close-circle-outline" size={18} color={cores.perigo} />
                  <View style={styles.flex}>
                    <Text style={styles.avisoCanceladoTitulo}>Motivo do cancelamento</Text>
                    <Text style={styles.avisoCanceladoTexto}>{pedido.motivoCancelamento}</Text>
                  </View>
                </View>
              ) : null}

              {pedido.observacao ? (
                <View style={styles.observacao}>
                  <Ionicons name="document-text-outline" size={16} color={cores.alerta} />
                  <View style={styles.flex}>
                    <Text style={styles.observacaoTitulo}>Observação</Text>
                    <Text style={styles.observacaoTexto}>{pedido.observacao}</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.caixaCliente}>
                <Text style={styles.rotuloPequeno}>Cliente</Text>
                <Text style={styles.clienteNome}>{pedido.cliente.nome}</Text>
                <Text style={styles.clienteCpf}>
                  {pedido.cliente.cpf
                    ? `CPF: ${formatarCpf(pedido.cliente.cpf)}`
                    : "Sem CPF vinculado"}
                  {pedido.cliente.telefone ? ` · ${formatarTelefone(pedido.cliente.telefone)}` : ""}
                </Text>
              </View>

              {aguardando && pedido.formaPagamento === "PIX" ? (
                <PagamentoPix
                  pedido={pedido}
                  itensConferidos={embalados}
                  gerado={pixGerado}
                  aoGerar={handleGerarPix}
                />
              ) : null}

              <View style={styles.secao}>
                <View style={styles.secaoCabecalho}>
                  <Text style={styles.secaoTitulo}>Conferência & embalagem</Text>
                  <Text style={styles.secaoDica}>
                    {embalados}/{pedido.itens.length} embalados
                  </Text>
                </View>

                {pedido.itens.map((item, indice) => (
                  <TouchableOpacity
                    key={`${item.produtoId}-${indice}`}
                    style={[styles.item, item.embalado ? styles.itemEmbalado : undefined]}
                    onPress={() => handleAlternarEmbalado(indice)}
                    disabled={!aguardando || salvando}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: item.embalado, disabled: !aguardando }}
                    accessibilityLabel={`${item.nome}, ${item.quantidade} unidades`}
                  >
                    <Ionicons
                      name={item.embalado ? "checkbox" : "square-outline"}
                      size={20}
                      color={item.embalado ? cores.sucesso : cores.textoTerciario}
                    />
                    <Text style={styles.itemIcone}>{item.icone}</Text>
                    <View style={styles.flex}>
                      <Text
                        style={[
                          styles.itemNome,
                          item.embalado ? styles.itemNomeEmbalado : undefined,
                        ]}
                        numberOfLines={1}
                      >
                        {item.nome}
                      </Text>
                      <Text style={styles.itemLotes} numberOfLines={2}>
                        {item.lotes.length > 0
                          ? item.lotes
                              .map((lote) => `${lote.codigo} ×${lote.quantidade}`)
                              .join(" · ")
                          : "Sem lote (estoque sem registro de lote)"}
                      </Text>
                    </View>
                    <Text style={styles.itemQuantidade}>{item.quantidade} un.</Text>
                  </TouchableOpacity>
                ))}

                {pedido.itensBalcao.map((item, indice) => (
                  <View key={`balcao-${indice}`} style={[styles.item, styles.itemBalcao]}>
                    <Ionicons name="gift-outline" size={18} color={cores.primaria} />
                    <Text style={[styles.itemNome, styles.itemBalcaoNome, styles.flex]}>
                      {item.nome}
                    </Text>
                    <Text style={styles.itemBalcaoPreco}>{formatarMoeda(item.preco)}</Text>
                  </View>
                ))}
              </View>

              {aguardando ? (
                <View style={styles.caixaBalcao}>
                  <Text style={styles.caixaBalcaoTitulo}>Adicionar itens de balcão</Text>
                  <View style={styles.opcoesBalcao}>
                    {ITENS_BALCAO.map((item) => (
                      <TouchableOpacity
                        key={item.nome}
                        style={styles.opcaoBalcao}
                        onPress={() => handleAdicionarBalcao(item)}
                        disabled={salvando}
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
              ) : null}

              {status === "PAGO" ? (
                <View style={styles.faixaPago}>
                  <Ionicons name="checkmark-circle" size={20} color={cores.sucesso} />
                  <View style={styles.flex}>
                    <Text style={styles.faixaPagoTitulo}>Venda concluída</Text>
                    <Text style={styles.faixaPagoTexto}>
                      {pedido.pagoEm ? `Pago em ${formatarData(pedido.pagoEm)}. ` : ""}
                      Use o botão abaixo para gerar ou reenviar o comprovante.
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.resumo}>
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoRotulo}>Subtotal</Text>
                  <Text style={styles.resumoValor}>{formatarMoeda(pedido.subtotal)}</Text>
                </View>
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoRotulo}>Desconto</Text>
                  <Text style={[styles.resumoValor, styles.resumoDesconto]}>
                    - {formatarMoeda(pedido.desconto)}
                  </Text>
                </View>
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoRotulo}>Pagamento</Text>
                  <Text style={styles.resumoPagamento}>
                    {rotuloFormaPagamento(pedido.formaPagamento)}
                  </Text>
                </View>
                <View style={[styles.resumoLinha, styles.resumoTotalLinha]}>
                  <Text style={styles.resumoTotalRotulo}>Valor a cobrar</Text>
                  <Text style={styles.resumoTotal}>{formatarMoeda(pedido.total)}</Text>
                </View>
              </View>

              {(pedido.eventos ?? []).length > 0 ? (
                <View style={styles.secao}>
                  <Text style={styles.secaoTitulo}>Histórico do pedido</Text>
                  {[...pedido.eventos].reverse().map((evento, indice) => (
                    <View key={`${evento.tipo}-${evento.data}-${indice}`} style={styles.evento}>
                      <View
                        style={[
                          styles.eventoPonto,
                          evento.tipo === "cancelado" ? styles.eventoPontoPerigo : undefined,
                          evento.tipo === "pago" ? styles.eventoPontoSucesso : undefined,
                        ]}
                      />
                      <View style={styles.flex}>
                        <Text style={styles.eventoTitulo}>
                          {ROTULO_EVENTO[evento.tipo]} · {evento.responsavel}
                        </Text>
                        <Text style={styles.eventoData}>{formatarData(evento.data)}</Text>
                        {evento.motivo ? (
                          <Text style={styles.eventoMotivo}>Motivo: {evento.motivo}</Text>
                        ) : null}
                        {evento.descricao ? (
                          <Text style={styles.eventoMotivo}>{evento.descricao}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {rodape ? <View style={styles.rodape}>{rodape}</View> : null}
    </SafeAreaView>
  );
}
