import { useMemo } from "react";
import { Text, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { TabelaLotesProps } from "@/types";
import { formatarDataCurta } from "@/utils/data";
import { calcularDiasParaVencer, calcularStatusLote, descreverPrazo } from "@/utils/lote";
import { formatarMoeda } from "@/utils/moeda";

import { criarEstilos } from "./styles";


export function TabelaLotes({ lotes }: TabelaLotesProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  if (lotes.length === 0) {
    return <Text style={styles.vazio}>Nenhum lote registrado ainda.</Text>;
  }

  return (
    <View>
      {lotes.map((lote) => {
        const status = calcularStatusLote(lote.validade);
        const rotuloStatus =
          lote.validade && status !== "regular"
            ? descreverPrazo(calcularDiasParaVencer(lote.validade))
            : lote.validade
              ? "Regular"
              : "Não expira";

        return (
          <View
            key={lote.id}
            style={[styles.linha, lote.saldoRestante === 0 ? styles.linhaEsgotada : undefined]}
          >
            <View style={styles.linhaTopo}>
              <Text style={styles.codigo} numberOfLines={1}>
                {lote.codigo}
              </Text>
              <View
                style={[
                  styles.selo,
                  status === "vencendo" ? styles.seloVencendo : undefined,
                  status === "vencido" ? styles.seloVencido : undefined,
                ]}
              >
                <Text
                  style={[
                    styles.seloTexto,
                    status === "vencendo" ? styles.seloTextoVencendo : undefined,
                    status === "vencido" ? styles.seloTextoVencido : undefined,
                  ]}
                >
                  {rotuloStatus.charAt(0).toUpperCase() + rotuloStatus.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.grade}>
              <View style={styles.campo}>
                <Text style={styles.campoRotulo}>Validade</Text>
                <Text style={styles.campoValor}>
                  {lote.validade ? formatarDataCurta(lote.validade) : "Não expira"}
                </Text>
              </View>
              <View style={styles.campo}>
                <Text style={styles.campoRotulo}>Qtd. entrada</Text>
                <Text style={styles.campoValor}>{lote.quantidadeEntrada} un.</Text>
              </View>
              <View style={styles.campo}>
                <Text style={styles.campoRotulo}>Saldo restante</Text>
                <Text style={styles.campoValor}>{lote.saldoRestante} un.</Text>
              </View>
              <View style={styles.campo}>
                <Text style={styles.campoRotulo}>Custo unit.</Text>
                <Text style={styles.campoValor}>{formatarMoeda(lote.custoUnitario)}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
