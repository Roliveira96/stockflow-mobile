import { StyleSheet } from "react-native";

import { ALVO_TOQUE_MINIMO, cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: raios.lg,
    backgroundColor: cores.superficie,
    padding: 18,
    marginBottom: 14,
    ...sombra.cartao,
  },
  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  textos: {
    flex: 1,
  },
  nome: {
    fontSize: 17,
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  descricao: {
    marginTop: 2,
    fontSize: 13,
    color: cores.textoTerciario,
  },
  preco: {
    fontSize: 17,
    fontWeight: "800",
    color: cores.primaria,
  },
  linhaDetalhes: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  detalheItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detalheTexto: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: cores.fundo,
  },
  selos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flexShrink: 1,
  },
  selo: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: raios.pill,
    backgroundColor: cores.sucessoFundo,
  },
  seloInativo: {
    backgroundColor: cores.neutroFundo,
  },
  seloTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.sucesso,
  },
  seloTextoInativo: {
    color: cores.textoTerciario,
  },
  seloAlerta: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: raios.pill,
    backgroundColor: cores.alertaFundo,
  },
  seloTextoAlerta: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.alerta,
  },
  acoes: {
    flexDirection: "row",
    gap: 8,
  },
  botaoAcao: {
    width: ALVO_TOQUE_MINIMO,
    height: ALVO_TOQUE_MINIMO,
    borderRadius: raios.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.neutroFundo,
  },
  botaoAcaoPrimaria: {
    backgroundColor: cores.primariaFundo,
  },
  botaoAcaoPerigo: {
    backgroundColor: cores.perigoFundo,
  },
});
