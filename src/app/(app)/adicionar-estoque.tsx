import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { SeletorData } from "@/components/SeletorData";
import { cores } from "@/constants/theme";
import { useCampoMoeda } from "@/hooks/useCampoMoeda";
import { api } from "@/services/api";
import { styles } from "@/styles/adicionar-estoque.styles";
import type { DadosProduto, Produto } from "@/types";
import { compararProdutos } from "@/utils/logProduto";
import {
  calcularDiasParaVencer,
  calcularStatusLote,
  gerarCodigoLote,
  MARGEM_ALVO_PADRAO,
  sugerirPrecoVenda,
} from "@/utils/lote";
import { formatarMoeda } from "@/utils/moeda";

export default function AdicionarEstoque() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [codigo, setCodigo] = useState(gerarCodigoLote());
  const [naoExpira, setNaoExpira] = useState(false);
  const [validade, setValidade] = useState("");
  const [quantidadeEntrada, setQuantidadeEntrada] = useState("");
  const campoCusto = useCampoMoeda(0);
  const [atualizarPrecoCatalogo, setAtualizarPrecoCatalogo] = useState(false);

  useEffect(() => {
    async function buscarProduto() {
      try {
        const resposta = await api.get<Produto>(`/produtos/${id}`);
        setProduto(resposta.data);
      } catch {
        Alert.alert("Erro de conexão", "Não foi possível carregar o produto.");
        router.back();
      } finally {
        setCarregando(false);
      }
    }

    buscarProduto();
  }, [id, router]);

  const statusValidade = !naoExpira && validade ? calcularStatusLote(validade) : "regular";
  const diasParaVencer = !naoExpira && validade ? calcularDiasParaVencer(validade) : 0;

  const avisoValidade =
    statusValidade === "vencido"
      ? `Essa data já passou (há ${Math.abs(diasParaVencer)} dia${Math.abs(diasParaVencer) === 1 ? "" : "s"}). O produto já estaria vencido — confira se a validade foi informada corretamente.`
      : statusValidade === "vencendo"
        ? `Esse lote vence em ${diasParaVencer} dia${diasParaVencer === 1 ? "" : "s"} — fica próximo do vencimento.`
        : "";

  const quantidadeValida =
    quantidadeEntrada.trim().length > 0 &&
    !Number.isNaN(Number(quantidadeEntrada)) &&
    Number(quantidadeEntrada) > 0;
  const erroQuantidade =
    quantidadeEntrada.trim().length > 0 && !quantidadeValida
      ? "Informe uma quantidade maior que zero."
      : "";

  const formularioValido =
    codigo.trim().length > 0 &&
    (naoExpira || validade.trim().length > 0) &&
    quantidadeValida &&
    campoCusto.centavos > 0;

  const margemAtual = produto ? ((produto.preco - campoCusto.valor) / produto.preco) * 100 : 0;
  const precoSugerido = sugerirPrecoVenda(campoCusto.valor, MARGEM_ALVO_PADRAO);
  const mostrarSimulador = produto !== null && campoCusto.centavos > 0;

  async function handleSalvar() {
    if (!produto) return;

    setEnviando(true);

    try {
      const agora = new Date().toISOString();
      const quantidade = Number(quantidadeEntrada);

      await api.post("/lotes", {
        produtoId: id,
        codigo: codigo.trim(),
        validade: naoExpira ? null : validade.trim(),
        quantidadeEntrada: quantidade,
        saldoRestante: quantidade,
        custoUnitario: campoCusto.valor,
        criadoEm: agora,
      });

      const dadosAtualizados: DadosProduto = {
        nome: produto.nome,
        codigoBarras: produto.codigoBarras,
        quantidade: produto.quantidade + quantidade,
        preco: atualizarPrecoCatalogo ? Number(precoSugerido.toFixed(2)) : produto.preco,
        descricao: produto.descricao,
        ativo: produto.ativo,
      };

      const alteracoes = compararProdutos(produto, dadosAtualizados);

      await api.put(`/produtos/${id}`, {
        ...dadosAtualizados,
        criadoEm: produto.criadoEm,
        atualizadoEm: agora,
      });

      if (alteracoes.length > 0) {
        await api.post("/logs", {
          produtoId: id,
          produtoNome: produto.nome,
          data: agora,
          alteracoes,
        });
      }

      Alert.alert("Estoque adicionado", "O lote foi registrado com sucesso.");
      router.back();
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível adicionar o estoque.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando || !produto) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator
          style={styles.carregando}
          size="large"
          color={cores.primaria}
          accessibilityLabel="Carregando produto"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Adicionar estoque</Text>
          <Text style={styles.subtitulo}>{produto.nome}</Text>

          <View style={styles.linhaCodigo}>
            <View style={styles.campoCodigo}>
              <CustomInput label="Código do lote" value={codigo} onChangeText={setCodigo} />
            </View>
            <TouchableOpacity
              style={styles.botaoGerar}
              onPress={() => setCodigo(gerarCodigoLote())}
              accessibilityRole="button"
              accessibilityLabel="Gerar código automático"
            >
              <Text style={styles.botaoGerarTexto}>Gerar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linhaSwitch}>
            <Text style={styles.rotuloSwitch}>Não expira</Text>
            <Switch
              value={naoExpira}
              onValueChange={setNaoExpira}
              trackColor={{ true: cores.primaria }}
              accessibilityLabel="Não expira"
              accessibilityRole="switch"
            />
          </View>

          {naoExpira ? null : (
            <>
              <SeletorData
                label="Validade"
                valor={validade || null}
                onSelecionar={setValidade}
              />
              {avisoValidade ? (
                <View
                  style={[
                    styles.avisoCaixa,
                    statusValidade === "vencido" ? styles.avisoCaixaPerigo : undefined,
                  ]}
                >
                  <Ionicons
                    name={statusValidade === "vencido" ? "alert-circle-outline" : "time-outline"}
                    size={18}
                    color={statusValidade === "vencido" ? cores.perigo : cores.alerta}
                  />
                  <Text
                    style={[
                      styles.avisoTexto,
                      statusValidade === "vencido" ? styles.avisoTextoPerigo : undefined,
                    ]}
                  >
                    {avisoValidade}
                  </Text>
                </View>
              ) : null}
            </>
          )}

          <CustomInput
            label="Quantidade recebida"
            value={quantidadeEntrada}
            onChangeText={setQuantidadeEntrada}
            erro={erroQuantidade}
            keyboardType="numeric"
            placeholder="0"
          />

          <CustomInput
            label="Custo unitário"
            value={campoCusto.texto}
            onChangeText={campoCusto.aoMudarTexto}
            keyboardType="numeric"
            selection={campoCusto.selecao}
            onSelectionChange={campoCusto.aoFocar}
            onFocus={campoCusto.aoFocar}
          />

          {mostrarSimulador ? (
            <View style={styles.simulador}>
              <Text style={styles.simuladorTitulo}>Análise de margem</Text>

              <View style={styles.simuladorLinha}>
                <Text style={styles.simuladorRotulo}>Preço de venda atual</Text>
                <Text style={styles.simuladorValor}>{formatarMoeda(produto.preco)}</Text>
              </View>
              <View style={styles.simuladorLinha}>
                <Text style={styles.simuladorRotulo}>Nova margem deste lote</Text>
                <Text
                  style={[
                    styles.simuladorValor,
                    margemAtual < MARGEM_ALVO_PADRAO
                      ? styles.simuladorValorAlerta
                      : styles.simuladorValorOk,
                  ]}
                >
                  {margemAtual.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.simuladorLinha}>
                <Text style={styles.simuladorRotulo}>Margem alvo</Text>
                <Text style={styles.simuladorValor}>{MARGEM_ALVO_PADRAO.toFixed(1)}%</Text>
              </View>

              {margemAtual < MARGEM_ALVO_PADRAO ? (
                <View style={styles.sugestaoCaixa}>
                  <Text style={styles.sugestaoTexto}>
                    Para manter a margem de {MARGEM_ALVO_PADRAO}%, o novo preço de venda sugerido
                    é <Text style={styles.sugestaoDestaque}>{formatarMoeda(precoSugerido)}</Text>.
                  </Text>

                  <TouchableOpacity
                    style={styles.linhaCheckbox}
                    onPress={() => setAtualizarPrecoCatalogo((atual) => !atual)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: atualizarPrecoCatalogo }}
                    accessibilityLabel="Atualizar preço de venda do catálogo"
                  >
                    <Switch
                      value={atualizarPrecoCatalogo}
                      onValueChange={setAtualizarPrecoCatalogo}
                      trackColor={{ true: cores.primaria }}
                    />
                    <Text style={styles.checkboxTexto}>
                      Atualizar preço de venda do catálogo para {formatarMoeda(precoSugerido)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : null}

          <CustomButton
            titulo="Salvar estoque"
            onPress={handleSalvar}
            carregando={enviando}
            desabilitado={!formularioValido}
            icone="cube-outline"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
