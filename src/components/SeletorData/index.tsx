import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { SeletorDataProps } from "@/types";
import { formatarDataCurta } from "@/utils/data";

import { criarEstilos } from "./styles";

const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function paraIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function SeletorData({ label, valor, onSelecionar, erro }: SeletorDataProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [aberto, setAberto] = useState(false);
  const dataSelecionada = valor ? new Date(`${valor}T00:00:00`) : null;
  const [mesExibido, setMesExibido] = useState(dataSelecionada ?? new Date());

  const primeiroDiaMes = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), 1);
  const diasNoMes = new Date(mesExibido.getFullYear(), mesExibido.getMonth() + 1, 0).getDate();
  const offsetSemana = primeiroDiaMes.getDay();

  const celulas: (number | null)[] = [
    ...Array.from({ length: offsetSemana }, () => null),
    ...Array.from({ length: diasNoMes }, (_, indice) => indice + 1),
  ];

  function handleSelecionarDia(dia: number) {
    const dataEscolhida = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), dia);
    onSelecionar(paraIso(dataEscolhida));
    setAberto(false);
  }

  function mudarMes(delta: number) {
    setMesExibido(new Date(mesExibido.getFullYear(), mesExibido.getMonth() + delta, 1));
  }

  const hoje = new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.campo, erro ? styles.campoComErro : undefined]}
        onPress={() => setAberto((atual) => !atual)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={valor ? styles.campoTexto : styles.campoPlaceholder}>
          {valor ? formatarDataCurta(valor) : "DD/MM/AAAA"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={cores.textoTerciario} />
      </TouchableOpacity>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {aberto ? (
        <View style={styles.painel}>
          <View style={styles.cabecalhoMes}>
            <TouchableOpacity
              style={styles.botaoMes}
              onPress={() => mudarMes(-1)}
              accessibilityRole="button"
              accessibilityLabel="Mês anterior"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={20} color={cores.textoPrimario} />
            </TouchableOpacity>
            <Text style={styles.mesTexto}>
              {NOMES_MES[mesExibido.getMonth()]} {mesExibido.getFullYear()}
            </Text>
            <TouchableOpacity
              style={styles.botaoMes}
              onPress={() => mudarMes(1)}
              accessibilityRole="button"
              accessibilityLabel="Próximo mês"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-forward" size={20} color={cores.textoPrimario} />
            </TouchableOpacity>
          </View>

          <View style={styles.linhaSemana}>
            {DIAS_SEMANA.map((dia, indice) => (
              <Text key={indice} style={styles.diaSemanaTexto}>
                {dia}
              </Text>
            ))}
          </View>

          <View style={styles.grade}>
            {celulas.map((dia, indice) => {
              if (dia === null) {
                return <View key={indice} style={styles.celulaDia} />;
              }

              const dataCelula = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), dia);
              const selecionado =
                dataSelecionada !== null && paraIso(dataCelula) === paraIso(dataSelecionada);
              const ehHoje = paraIso(dataCelula) === paraIso(hoje);

              return (
                <TouchableOpacity
                  key={indice}
                  style={[styles.celulaDia, selecionado ? styles.celulaDiaSelecionada : undefined]}
                  onPress={() => handleSelecionarDia(dia)}
                  accessibilityRole="button"
                  accessibilityLabel={`Dia ${dia}`}
                >
                  <Text
                    style={[
                      styles.celulaDiaTexto,
                      selecionado ? styles.celulaDiaTextoSelecionado : undefined,
                      ehHoje && !selecionado ? styles.celulaDiaTextoHoje : undefined,
                    ]}
                  >
                    {dia}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
