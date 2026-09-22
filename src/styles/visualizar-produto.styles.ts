import { StyleSheet } from "react-native";

import { cores, raios } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.fundo,
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
    color: cores.textoPrimario,
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
    borderRadius: raios.pill,
    backgroundColor: cores.sucessoFundo,
  },
  seloInativo: {
    backgroundColor: cores.neutroFundo,
  },
  seloTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.sucesso,
  },
  seloTextoInativo: {
    color: cores.textoTerciario,
  },
  seloAlerta: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: raios.pill,
    backgroundColor: cores.alertaFundo,
  },
  seloTextoAlerta: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.alerta,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
    marginBottom: 16,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
  },
  linhaSemBorda: {
    borderBottomWidth: 0,
  },
  linhaRotulo: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  linhaValor: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoPrimario,
  },
  descricaoTexto: {
    marginTop: 8,
    fontSize: 14,
    color: cores.textoSecundario,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.textoPrimario,
    marginBottom: 12,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
    paddingVertical: 10,
  },
  logData: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginBottom: 4,
  },
  logAlteracao: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  logCampo: {
    fontWeight: "700",
  },
  vazio: {
    fontSize: 13,
    color: cores.textoTerciario,
  },
  acoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 24,
  },
  botaoAcao: {
    flex: 1,
  },
  botaoExcluir: {
    backgroundColor: cores.perigo,
  },
});
