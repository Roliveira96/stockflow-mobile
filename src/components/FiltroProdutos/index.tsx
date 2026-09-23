import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { FiltroProdutosProps, StatusFiltro } from "@/types";

import { criarEstilos } from "./styles";

const OPCOES_STATUS: { valor: StatusFiltro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "disponiveis", rotulo: "Disponíveis p/ venda" },
  { valor: "vencendo", rotulo: "Perto do vencimento" },
  { valor: "ativos", rotulo: "Ativos" },
  { valor: "sem-estoque", rotulo: "Sem estoque" },
  { valor: "inativos", rotulo: "Inativos" },
];

export function FiltroProdutos({
  sugestoes,
  busca,
  aoMudarBusca,
  filtroStatus,
  aoMudarFiltroStatus,
  totalFiltrado,
}: FiltroProdutosProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false);
  const [focado, setFocado] = useState(false);

  const sugestoesExibidas = sugestoesVisiveis ? sugestoes : [];

  function handleSelecionarSugestao(nome: string) {
    aoMudarBusca(nome);
    setSugestoesVisiveis(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buscaContainer}>
        <View style={[styles.campoBusca, focado ? styles.campoBuscaFocado : undefined]}>
          <Ionicons name="search" size={17} color={cores.textoTerciario} />
          <TextInput
            style={styles.inputBusca}
            value={busca}
            onChangeText={(texto) => {
              aoMudarBusca(texto);
              setSugestoesVisiveis(texto.trim().length > 0);
            }}
            onFocus={() => {
              setFocado(true);
              setSugestoesVisiveis(busca.trim().length > 0);
            }}
            onBlur={() => {
              setFocado(false);
              setTimeout(() => setSugestoesVisiveis(false), 150);
            }}
            placeholder="Buscar por nome do produto..."
            placeholderTextColor={cores.textoTerciario}
            accessibilityLabel="Buscar produto"
            returnKeyType="search"
          />
          {busca.length > 0 ? (
            <TouchableOpacity
              style={styles.botaoLimpar}
              onPress={() => {
                aoMudarBusca("");
                setSugestoesVisiveis(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
            >
              <Ionicons name="close" size={16} color={cores.textoTerciario} />
            </TouchableOpacity>
          ) : null}
        </View>

        {sugestoesExibidas.length > 0 ? (
          <View style={styles.sugestoesContainer}>
            {sugestoesExibidas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.sugestaoItem}
                onPress={() => handleSelecionarSugestao(item.nome)}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${item.nome}`}
              >
                <Text style={styles.sugestaoIcone}>{item.categoriaIcone ?? "📦"}</Text>
                <Text style={styles.sugestaoTexto} numberOfLines={1}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
      >
        {OPCOES_STATUS.map((opcao) => {
          const selecionado = opcao.valor === filtroStatus;

          return (
            <TouchableOpacity
              key={opcao.valor}
              style={[styles.chip, selecionado ? styles.chipSelecionado : undefined]}
              onPress={() => aoMudarFiltroStatus(opcao.valor)}
              hitSlop={{ top: 6, bottom: 6 }}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por ${opcao.rotulo}`}
              accessibilityState={{ selected: selecionado }}
            >
              <Text style={[styles.chipTexto, selecionado ? styles.chipTextoSelecionado : undefined]}>
                {selecionado ? `${opcao.rotulo} (${totalFiltrado})` : opcao.rotulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
