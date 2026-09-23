import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CardPedido } from "@/components/CardPedido";
import { MenuLateral } from "@/components/MenuLateral";
import { ModalPedidoCaixa } from "@/components/ModalPedidoCaixa";
import { NOME_USUARIO } from "@/constants/usuario";
import { useAuth } from "@/contexts/AuthContext";
import { useTema } from "@/contexts/TemaContext";
import { listarPedidos } from "@/services/vendas";
import { criarEstilos } from "@/styles/caixa.styles";
import type { Pedido, StatusPedido } from "@/types";
import { extrairDigitos, formatarMoeda } from "@/utils/moeda";

const INTERVALO_ATUALIZACAO_MS = 15000;

const FILTROS: { valor: StatusPedido; rotulo: string }[] = [
  { valor: "AGUARDANDO", rotulo: "Aguardando" },
  { valor: "PAGO", rotulo: "Pagos" },
  { valor: "CANCELADO", rotulo: "Cancelados" },
];

function ehHoje(iso: string | null) {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

export default function Caixa() {
  const { logout, usuario } = useAuth();
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [atualizando, setAtualizando] = useState(false);
  const [filtro, setFiltro] = useState<StatusPedido>("AGUARDANDO");
  const [busca, setBusca] = useState("");
  const [pedidoAberto, setPedidoAberto] = useState<Pedido | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const carregarPedidos = useCallback(async (silencioso = false) => {
    try {
      const lista = await listarPedidos();
      setPedidos(lista);
      setPedidoAberto((atual) =>
        atual ? (lista.find((pedido) => pedido.id === atual.id) ?? atual) : null
      );
    } catch {
      if (!silencioso) {
        Alert.alert("Erro de conexão", "Não foi possível carregar os pedidos.");
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPedidos();
      const intervalo = setInterval(() => carregarPedidos(true), INTERVALO_ATUALIZACAO_MS);
      return () => clearInterval(intervalo);
    }, [carregarPedidos])
  );

  async function handleAtualizar() {
    setAtualizando(true);
    await carregarPedidos();
    setAtualizando(false);
  }

  function handlePedidoAtualizado(pedido: Pedido) {
    const statusAnterior = pedidos.find((item) => item.id === pedido.id)?.status;
    setPedidos((atual) => atual.map((item) => (item.id === pedido.id ? pedido : item)));

    if (statusAnterior !== pedido.status) {
      setPedidoAberto(null);
      setFiltro(pedido.status);
    } else {
      setPedidoAberto(pedido);
    }
  }

  const contagem = useMemo(
    () =>
      pedidos.reduce<Record<StatusPedido, number>>(
        (total, pedido) => ({ ...total, [pedido.status]: total[pedido.status] + 1 }),
        { AGUARDANDO: 0, PAGO: 0, CANCELADO: 0 }
      ),
    [pedidos]
  );

  const recebidoHoje = pedidos
    .filter((pedido) => pedido.status === "PAGO" && ehHoje(pedido.pagoEm))
    .reduce((soma, pedido) => soma + pedido.total, 0);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const digitos = extrairDigitos(busca);

    return pedidos.filter((pedido) => {
      if (pedido.status !== filtro) return false;
      if (!termo) return true;

      return (
        pedido.numero.toLowerCase().includes(termo) ||
        pedido.cliente.nome.toLowerCase().includes(termo) ||
        (digitos.length > 0 && (pedido.cliente.cpf ?? "").startsWith(digitos))
      );
    });
  }, [pedidos, filtro, busca]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecalho}>
        <View style={styles.linhaCabecalho}>
          <View style={styles.operador}>
            <View style={styles.logo}>
              <Ionicons name="cash-outline" size={20} color={cores.textoSobreCor} />
            </View>
            <View>
              <Text style={styles.titulo}>Caixa</Text>
              <Text style={styles.subtitulo}>Operador: {NOME_USUARIO}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.botaoMenu}
            onPress={() => setMenuAberto(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
          >
            <Ionicons name="menu" size={18} color={cores.textoSecundario} />
          </TouchableOpacity>
        </View>

        <View style={styles.metricas}>
          <View style={[styles.metrica, styles.metricaAlerta]}>
            <Text style={styles.metricaRotulo}>Na fila</Text>
            <Text style={[styles.metricaValor, styles.metricaValorAlerta]}>
              {contagem.AGUARDANDO}
            </Text>
          </View>
          <View style={[styles.metrica, styles.metricaSucesso]}>
            <Text style={styles.metricaRotulo}>Recebido hoje</Text>
            <Text style={[styles.metricaValor, styles.metricaValorSucesso]}>
              {formatarMoeda(recebidoHoje)}
            </Text>
          </View>
        </View>

        <View style={styles.campoBusca}>
          <Ionicons name="search" size={16} color={cores.textoTerciario} />
          <TextInput
            style={styles.inputBusca}
            value={busca}
            onChangeText={setBusca}
            placeholder="Nº do pedido, cliente ou CPF"
            placeholderTextColor={cores.textoTerciario}
            accessibilityLabel="Buscar pedido"
            autoCorrect={false}
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

        <View style={styles.filtros}>
          {FILTROS.map((opcao) => {
            const ativo = filtro === opcao.valor;

            return (
              <TouchableOpacity
                key={opcao.valor}
                style={[styles.filtro, ativo ? styles.filtroAtivo : undefined]}
                onPress={() => setFiltro(opcao.valor)}
                accessibilityRole="button"
                accessibilityState={{ selected: ativo }}
                accessibilityLabel={`${opcao.rotulo} (${contagem[opcao.valor]})`}
              >
                <Text style={[styles.filtroTexto, ativo ? styles.filtroTextoAtivo : undefined]}>
                  {opcao.rotulo} ({contagem[opcao.valor]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(pedido) => pedido.id}
        style={styles.flex}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={handleAtualizar}
            tintColor={cores.primaria}
            colors={[cores.primaria]}
          />
        }
        renderItem={({ item }) => (
          <CardPedido pedido={item} aoAbrir={() => setPedidoAberto(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="receipt-outline" size={26} color={cores.textoTerciario} />
            <Text style={styles.vazioTitulo}>Nenhum pedido nesta fila</Text>
            <Text style={styles.vazioTexto}>
              {filtro === "AGUARDANDO"
                ? "Os pedidos enviados pelo vendedor aparecem aqui automaticamente."
                : filtro === "PAGO"
                  ? "Nenhuma venda finalizada ainda."
                  : "Nenhum pedido cancelado."}
            </Text>
          </View>
        }
      />

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        nomeUsuario={NOME_USUARIO}
        emailUsuario={usuario?.email ?? ""}
        cargoUsuario="Operador de caixa"
        telaAtiva="caixa"
        pedidosPendentes={contagem.AGUARDANDO}
        aoSair={() => {
          setMenuAberto(false);
          logout();
        }}
      />

      <ModalPedidoCaixa
        pedido={pedidoAberto}
        operador={NOME_USUARIO}
        aoFechar={() => setPedidoAberto(null)}
        aoAtualizar={handlePedidoAtualizado}
      />
    </SafeAreaView>
  );
}
