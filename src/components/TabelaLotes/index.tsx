import { Text, View } from "react-native";

import type { TabelaLotesProps } from "@/types";
import { formatarData } from "@/utils/data";
import { calcularStatusLote } from "@/utils/lote";
import { formatarMoeda } from "@/utils/moeda";

import { styles } from "./styles";

const ROTULO_STATUS = {
  regular: "Regular",
  vencendo: "Vencendo em breve",
  vencido: "Vencido",
};

export function TabelaLotes({ lotes }: TabelaLotesProps) {
  if (lotes.length === 0) {
    return <Text style={styles.vazio}>Nenhum lote registrado ainda.</Text>;
  }

  return (
    <View>
      {lotes.map((lote) => {
        const status = calcularStatusLote(lote.validade);

        return (
          <View key={lote.id} style={styles.linha}>
            <View style={styles.linhaTopo}>
              <Text style={styles.codigo}>{lote.codigo}</Text>
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
                  {ROTULO_STATUS[status]}
                </Text>
              </View>
            </View>

            <View style={styles.grade}>
              <View style={styles.campo}>
                <Text style={styles.campoRotulo}>Validade</Text>
                <Text style={styles.campoValor}>
                  {lote.validade ? formatarData(lote.validade) : "Não expira"}
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
