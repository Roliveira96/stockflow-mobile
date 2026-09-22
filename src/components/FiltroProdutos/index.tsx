import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CustomInput } from "@/components/CustomInput";
import type { FiltroProdutosProps, StatusFiltro } from "@/types";

import { styles } from "./styles";

const OPCOES_STATUS: { valor: StatusFiltro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "ativos", rotulo: "Ativos" },
  { valor: "sem-estoque", rotulo: "Sem estoque" },
  { valor: "inativos", rotulo: "Inativos" },
];

export function FiltroProdutos({
  produtos,
  busca,
  aoMudarBusca,
  filtroStatus,
  aoMudarFiltroStatus,
}: FiltroProdutosProps) {
  const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false);

  const termo = busca.trim().toLowerCase();
  const sugestoes =
    sugestoesVisiveis && termo.length > 0
      ? produtos.filter((produto) => produto.nome.toLowerCase().includes(termo)).slice(0, 5)
      : [];

  function handleSelecionarSugestao(nome: string) {
    aoMudarBusca(nome);
    setSugestoesVisiveis(false);
  }

  return (
    <View style={styles.container}>
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
        {sugestoes.length > 0 ? (
          <View style={styles.sugestoesContainer}>
            <FlatList
              data={sugestoes}
              keyExtractor={(produto) => produto.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.sugestaoItem}
                  onPress={() => handleSelecionarSugestao(item.nome)}
                >
                  <Text style={styles.sugestaoTexto}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.chipsContainer}>
        {OPCOES_STATUS.map((opcao) => {
          const selecionado = opcao.valor === filtroStatus;

          return (
            <TouchableOpacity
              key={opcao.valor}
              style={[styles.chip, selecionado ? styles.chipSelecionado : undefined]}
              onPress={() => aoMudarFiltroStatus(opcao.valor)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.chipTexto, selecionado ? styles.chipTextoSelecionado : undefined]}
              >
                {opcao.rotulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
