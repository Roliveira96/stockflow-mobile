import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  carregando: {
    marginTop: 40,
  },
  cabecalho: {
    marginBottom: 16,
  },
  nome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#102A43",
  },
  selos: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selo: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#D3F9D8",
  },
  seloInativo: {
    backgroundColor: "#F0F4F8",
  },
  seloTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F9E44",
  },
  seloTextoInativo: {
    color: "#829AB1",
  },
  seloAlerta: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#FFF3BF",
  },
  seloTextoAlerta: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B08900",
  },
  cartao: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    padding: 16,
    marginBottom: 16,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  linhaSemBorda: {
    borderBottomWidth: 0,
  },
  linhaRotulo: {
    fontSize: 14,
    color: "#627D98",
  },
  linhaValor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#102A43",
  },
  descricaoTexto: {
    marginTop: 8,
    fontSize: 14,
    color: "#334E68",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#102A43",
    marginBottom: 12,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
    paddingVertical: 10,
  },
  logData: {
    fontSize: 12,
    color: "#9AA5B1",
    marginBottom: 4,
  },
  logAlteracao: {
    fontSize: 13,
    color: "#334E68",
  },
  logCampo: {
    fontWeight: "700",
  },
  vazio: {
    fontSize: 13,
    color: "#829AB1",
  },
  acoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  botaoAcao: {
    flex: 1,
  },
  botaoExcluir: {
    backgroundColor: "#E12D39",
  },
});
