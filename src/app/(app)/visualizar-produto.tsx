import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BarraTopo } from "@/components/BarraTopo";
import { CustomButton } from "@/components/CustomButton";
import { TabelaLotes } from "@/components/TabelaLotes";
import { useTema } from "@/contexts/TemaContext";
import { useToast } from "@/contexts/ToastContext";
import { api } from "@/services/api";
import { criarEstilos } from "@/styles/visualizar-produto.styles";
import type { Lote, LogEdicao, Produto } from "@/types";
import { formatarData, formatarDataCurta } from "@/utils/data";
import { calcularNivelEstoque } from "@/utils/estoque";
import {
  calcularCustoMedioPonderado,
  calcularMargem,
  DIAS_LIMITE_VENCENDO,
  descreverPrazo,
  MARGEM_ALVO_PADRAO,
  resumirVencimentos,
} from "@/utils/lote";
import { formatarMoeda } from "@/utils/moeda";

type Aba = "produto" | "lotes" | "log";

const ABAS: { chave: Aba; rotulo: string }[] = [
  { chave: "produto", rotulo: "Produto" },
  { chave: "lotes", rotulo: "Lotes" },
  { chave: "log", rotulo: "Histórico" },
];

export default function VisualizarProduto() {
  const router = useRouter();
  const { cores } = useTema();
  const { mostrarToast } = useToast();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [logs, setLogs] = useState<LogEdicao[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("produto");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function buscarDados() {
        try {
          const [respostaProduto, respostaLogs, respostaLotes] = await Promise.all([
            api.get<Produto>(`/produtos/${id}`),
            api.get<LogEdicao[]>("/logs", { params: { produtoId: id } }),
            api.get<Lote[]>("/lotes", { params: { produtoId: id } }),
          ]);

          if (ativo) {
            setProduto(respostaProduto.data);
            setLogs([...respostaLogs.data].reverse());
            setLotes([...respostaLotes.data].reverse());
          }
        } catch {
          if (ativo) {
            Alert.alert("Erro de conexão", "Não foi possível carregar o produto.");
            router.back();
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      buscarDados();

      return () => {
        ativo = false;
      };
    }, [id, router])
  );

  function handleExcluir() {
    Alert.alert(
      "Remover produto",
      `Tem certeza que deseja remover "${produto?.nome ?? "este produto"}"? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setExcluindo(true);

            try {
              await api.delete(`/produtos/${id}`);
              mostrarToast("Produto excluído com sucesso");
              router.back();
            } catch {
              Alert.alert("Erro de conexão", "Não foi possível remover o produto.");
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
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

  const nivel = calcularNivelEstoque(produto.quantidade);
  const vencimento = resumirVencimentos(lotes);
  const lotesComAtencao = [...vencimento.lotesVencidos, ...vencimento.lotesVencendo];
  const lotesComValidade = lotes.filter((lote) => lote.validade && lote.saldoRestante > 0);
  const custoMedio =
    lotes.length > 0 ? calcularCustoMedioPonderado(lotes) : (produto.precoCusto ?? null);
  const margemMedia = custoMedio !== null ? calcularMargem(produto.preco, custoMedio) : null;

  const avisoEstoque =
    produto.quantidade === 0
      ? "Sem estoque"
      : nivel === "critico"
        ? "Últimas unidades"
        : nivel === "baixo"
          ? "Reposição recomendada"
          : "Estoque saudável";

  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraTopo
        rotuloVoltar="Voltar ao catálogo"
        aoVoltar={() => router.back()}
        direita={
          <View style={[styles.seloStatus, produto.ativo ? undefined : styles.seloStatusInativo]}>
            <View
              style={[styles.pontoStatus, produto.ativo ? undefined : styles.pontoStatusInativo]}
            />
            <Text
              style={[
                styles.seloStatusTexto,
                produto.ativo ? undefined : styles.seloStatusTextoInativo,
              ]}
            >
              {produto.ativo ? "Ativo" : "Inativo"}
            </Text>
          </View>
        }
      />

      <View style={styles.cabecalho}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <View style={styles.linhaIdentificacao}>
          {produto.categoria ? (
            <View style={styles.seloCategoria}>
              <Text style={styles.seloCategoriaTexto}>
                {produto.categoriaIcone ?? "📦"} {produto.categoria}
              </Text>
            </View>
          ) : null}
          <Text style={styles.codigoCabecalho}>{produto.codigoBarras}</Text>
          {produto.codigoAuxiliar ? (
            <Text style={styles.codigoCabecalho}>· {produto.codigoAuxiliar}</Text>
          ) : null}
        </View>

        <View style={styles.abas} accessibilityRole="tablist">
          {ABAS.map((aba) => {
            const ativa = aba.chave === abaAtiva;
            const rotulo = aba.chave === "lotes" ? `${aba.rotulo} (${lotes.length})` : aba.rotulo;

            return (
              <TouchableOpacity
                key={aba.chave}
                style={[styles.aba, ativa ? styles.abaAtiva : undefined]}
                onPress={() => setAbaAtiva(aba.chave)}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativa }}
                accessibilityLabel={`Aba ${rotulo}`}
              >
                <Text style={[styles.abaTexto, ativa ? styles.abaTextoAtiva : undefined]}>
                  {rotulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
        {abaAtiva === "produto" ? (
          <>
            <View style={styles.metricas}>
              <View style={styles.metrica}>
                <Text style={styles.metricaRotulo}>Preço de venda</Text>
                <Text style={styles.metricaValor}>{formatarMoeda(produto.preco)}</Text>
                {margemMedia !== null ? (
                  <Text
                    style={[
                      styles.metricaNota,
                      margemMedia >= MARGEM_ALVO_PADRAO
                        ? styles.metricaNotaSucesso
                        : styles.metricaNotaAlerta,
                    ]}
                  >
                    Margem média: {margemMedia.toFixed(1)}%
                  </Text>
                ) : (
                  <Text style={styles.metricaNota}>Sem custo informado</Text>
                )}
              </View>

              <View style={styles.metrica}>
                <Text style={styles.metricaRotulo}>Saldo em estoque</Text>
                <Text style={[styles.metricaValor, styles.metricaValorPrimaria]}>
                  {produto.quantidade} un.
                </Text>
                <Text
                  style={[
                    styles.metricaNota,
                    nivel === "normal"
                      ? styles.metricaNotaSucesso
                      : nivel === "baixo"
                        ? styles.metricaNotaAlerta
                        : styles.metricaNotaPerigo,
                  ]}
                >
                  {avisoEstoque}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.cartaoValidade,
                vencimento.lotesVencidos.length > 0
                  ? styles.cartaoValidadePerigo
                  : vencimento.lotesVencendo.length > 0
                    ? styles.cartaoValidadeAlerta
                    : undefined,
              ]}
            >
              <View style={styles.validadeCabecalho}>
                <Ionicons
                  name={
                    vencimento.lotesVencidos.length > 0
                      ? "alert-circle-outline"
                      : vencimento.lotesVencendo.length > 0
                        ? "time-outline"
                        : "checkmark-circle-outline"
                  }
                  size={18}
                  color={
                    vencimento.lotesVencidos.length > 0
                      ? cores.perigo
                      : vencimento.lotesVencendo.length > 0
                        ? cores.alerta
                        : cores.sucesso
                  }
                />
                <Text style={styles.validadeTitulo}>Validade dos lotes</Text>
              </View>

              {lotesComAtencao.length > 0 ? (
                <>
                  <View style={styles.validadeResumo}>
                    {vencimento.lotesVencendo.length > 0 ? (
                      <View style={styles.validadeNumero}>
                        <Text style={[styles.validadeNumeroValor, styles.validadeNumeroAlerta]}>
                          {vencimento.unidadesVencendo} un.
                        </Text>
                        <Text style={styles.validadeNumeroRotulo}>
                          perto do vencimento ({vencimento.lotesVencendo.length} lote
                          {vencimento.lotesVencendo.length === 1 ? "" : "s"})
                        </Text>
                      </View>
                    ) : null}
                    {vencimento.lotesVencidos.length > 0 ? (
                      <View style={styles.validadeNumero}>
                        <Text style={[styles.validadeNumeroValor, styles.validadeNumeroPerigo]}>
                          {vencimento.unidadesVencidas} un.
                        </Text>
                        <Text style={styles.validadeNumeroRotulo}>
                          já vencidas ({vencimento.lotesVencidos.length} lote
                          {vencimento.lotesVencidos.length === 1 ? "" : "s"})
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {lotesComAtencao.map(({ lote, diasParaVencer }) => (
                    <View key={lote.id} style={styles.loteAtencao}>
                      <View style={styles.flex}>
                        <Text style={styles.loteAtencaoCodigo}>{lote.codigo}</Text>
                        <Text
                          style={[
                            styles.loteAtencaoPrazo,
                            diasParaVencer < 0
                              ? styles.validadeNumeroPerigo
                              : styles.validadeNumeroAlerta,
                          ]}
                        >
                          {formatarDataCurta(lote.validade as string)} ·{" "}
                          {descreverPrazo(diasParaVencer)}
                        </Text>
                      </View>
                      <Text style={styles.loteAtencaoSaldo}>{lote.saldoRestante} un.</Text>
                    </View>
                  ))}
                </>
              ) : (
                <Text style={styles.validadeVazio}>
                  {lotesComValidade.length > 0
                    ? `Nenhum lote vence nos próximos ${DIAS_LIMITE_VENCENDO} dias.`
                    : "Nenhum lote com data de validade."}
                </Text>
              )}
            </View>

            <View style={styles.cartao}>
              <View style={styles.linha}>
                <Text style={styles.linhaRotulo}>Código de barras</Text>
                <Text style={[styles.linhaValor, styles.linhaValorMono]}>
                  {produto.codigoBarras}
                </Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.linhaRotulo}>Código auxiliar</Text>
                <Text style={[styles.linhaValor, styles.linhaValorMono]}>
                  {produto.codigoAuxiliar || "—"}
                </Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.linhaRotulo}>Categoria</Text>
                <Text style={styles.linhaValor}>
                  {produto.categoria ? `${produto.categoriaIcone ?? ""} ${produto.categoria}` : "—"}
                </Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.linhaRotulo}>Preço de custo</Text>
                <Text style={[styles.linhaValor, styles.linhaValorMono]}>
                  {produto.precoCusto ? formatarMoeda(produto.precoCusto) : "—"}
                </Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.linhaRotulo}>Custo médio ponderado</Text>
                <Text style={[styles.linhaValor, styles.linhaValorMono]}>
                  {lotes.length > 0 ? formatarMoeda(calcularCustoMedioPonderado(lotes)) : "—"}
                </Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.linhaRotulo}>Criado em</Text>
                <Text style={[styles.linhaValorSuave, styles.linhaValorMono]}>
                  {formatarData(produto.criadoEm)}
                </Text>
              </View>
              <View style={[styles.linha, styles.linhaSemBorda]}>
                <Text style={styles.linhaRotulo}>Última atualização</Text>
                <Text style={[styles.linhaValorSuave, styles.linhaValorMono]}>
                  {formatarData(produto.atualizadoEm)}
                </Text>
              </View>

              <View style={styles.descricao}>
                <Text style={styles.descricaoRotulo}>Descrição do item</Text>
                <View style={styles.descricaoCaixa}>
                  <Text style={styles.descricaoTexto}>
                    {produto.descricao || "Nenhuma descrição informada."}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        {abaAtiva === "lotes" ? (
          <>
            <View style={styles.secaoCabecalho}>
              <Text style={styles.secaoTitulo}>Lotes registrados</Text>
              <TouchableOpacity
                style={styles.botaoLink}
                onPress={() => router.push({ pathname: "/adicionar-estoque", params: { id } })}
                accessibilityRole="button"
                accessibilityLabel="Adicionar lote"
              >
                <Ionicons name="add" size={16} color={cores.primaria} />
                <Text style={styles.botaoLinkTexto}>Adicionar lote</Text>
              </TouchableOpacity>
            </View>
            <TabelaLotes lotes={lotes} />
          </>
        ) : null}

        {abaAtiva === "log" ? (
          <>
            <Text style={styles.secaoTitulo}>Linha do tempo de modificações</Text>
            {logs.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma alteração registrada ainda.</Text>
            ) : (
              <View style={styles.timeline}>
                {logs.map((log, indice) => (
                  <View key={log.id} style={styles.evento}>
                    <View
                      style={[
                        styles.eventoPonto,
                        indice === 0 ? styles.eventoPontoRecente : undefined,
                      ]}
                    />
                    <Text style={styles.eventoData}>{formatarData(log.data)}</Text>
                    {log.alteracoes.map((alteracao, indiceAlteracao) => (
                      <Text key={indiceAlteracao} style={styles.eventoTexto}>
                        {alteracao.campo}: <Text style={styles.eventoDe}>{alteracao.de}</Text>
                        {" → "}
                        <Text style={styles.eventoPara}>{alteracao.para}</Text>
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>

      <View style={styles.acoes}>
        <CustomButton
          titulo="Excluir"
          onPress={handleExcluir}
          carregando={excluindo}
          estiloContainer={styles.botaoAcao}
          icone="trash-outline"
          variante="perigo"
          compacto
        />
        <CustomButton
          titulo="Editar"
          onPress={() => router.push({ pathname: "/editar-produto", params: { id } })}
          estiloContainer={styles.botaoAcao}
          icone="create-outline"
          variante="neutro"
          compacto
        />
        <CustomButton
          titulo="Estoque"
          onPress={() => router.push({ pathname: "/adicionar-estoque", params: { id } })}
          estiloContainer={styles.botaoAcaoPrincipal}
          icone="add"
          compacto
        />
      </View>
    </SafeAreaView>
  );
}
