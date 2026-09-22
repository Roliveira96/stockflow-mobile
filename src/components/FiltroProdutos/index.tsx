import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CustomInput } from "@/components/CustomInput";
import { cores } from "@/constants/theme";
import type { FiltroProdutosProps, StatusFiltro } from "@/types";

import { styles } from "./styles";

const OPCOES_STATUS: { valor: StatusFiltro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
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
}: FiltroProdutosProps) {
  const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false);
  const [selectAberto, setSelectAberto] = useState(false);

  const sugestoesExibidas = sugestoesVisiveis ? sugestoes : [];
  const opcaoAtual =
    OPCOES_STATUS.find((opcao) => opcao.valor === filtroStatus) ?? OPCOES_STATUS[0];

  function handleSelecionarSugestao(nome: string) {
    aoMudarBusca(nome);
    setSugestoesVisiveis(false);
  }

  function handleSelecionarStatus(valor: StatusFiltro) {
    aoMudarFiltroStatus(valor);
    setSelectAberto(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <View style={styles.buscaContainer}>
          <CustomInput
            label="Buscar produto"
            value={busca}
            onChangeText={(texto) => {
              aoMudarBusca(texto);
              setSugestoesVisiveis(texto.trim().length > 0);
            }}
            onFocus={() => setSugestoesVisiveis(busca.trim().length > 0)}
            onBlur={() => setTimeout(() => setSugestoesVisiveis(false), 150)}
            placeholder="Digite o nome do produto"
          />
          {sugestoesExibidas.length > 0 ? (
            <View style={styles.sugestoesContainer}>
              <FlatList
                data={sugestoesExibidas}
                keyExtractor={(produto) => produto.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.sugestaoItem}
                    onPress={() => handleSelecionarSugestao(item.nome)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar ${item.nome}`}
                  >
                    <Text style={styles.sugestaoTexto}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Status</Text>
          <TouchableOpacity
            style={styles.selectCampo}
            onPress={() => setSelectAberto((atual) => !atual)}
            accessibilityRole="button"
            accessibilityLabel={`Filtro de status: ${opcaoAtual.rotulo}`}
          >
            <Text style={styles.selectTexto} numberOfLines={1}>
              {opcaoAtual.rotulo}
            </Text>
            <Ionicons
              name={selectAberto ? "chevron-up" : "chevron-down"}
              size={16}
              color={cores.textoSecundario}
            />
          </TouchableOpacity>

          {selectAberto ? (
            <View style={styles.selectPainel}>
              {OPCOES_STATUS.map((opcao) => {
                const selecionado = opcao.valor === filtroStatus;

                return (
                  <TouchableOpacity
                    key={opcao.valor}
                    style={[
                      styles.selectOpcao,
                      selecionado ? styles.selectOpcaoSelecionada : undefined,
                    ]}
                    onPress={() => handleSelecionarStatus(opcao.valor)}
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrar por ${opcao.rotulo}`}
                    accessibilityState={{ selected: selecionado }}
                  >
                    <Text
                      style={[
                        styles.selectOpcaoTexto,
                        selecionado ? styles.selectOpcaoTextoSelecionada : undefined,
                      ]}
                    >
                      {opcao.rotulo}
                    </Text>
                    {selecionado ? (
                      <Ionicons name="checkmark" size={16} color={cores.primaria} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
