import { StyleSheet } from "react-native";

import { cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  scroll: {
    flex: 1,
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
    marginBottom: 20,
  },
  nome: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: cores.textoPrimario,
  },
  selos: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: 18,
    marginBottom: 20,
    ...sombra.cartao,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
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
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  descricaoTexto: {
    marginTop: 10,
    fontSize: 14,
    color: cores.textoSecundario,
  },
  abas: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: cores.neutroFundo,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  aba: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: raios.sm,
  },
  abaAtiva: {
    backgroundColor: cores.superficie,
    ...sombra.flutuante,
  },
  abaTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.textoTerciario,
  },
  abaTextoAtiva: {
    color: cores.primaria,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
    paddingVertical: 12,
  },
  logData: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.textoTerciario,
    marginBottom: 4,
  },
  logAlteracao: {
    fontSize: 13,
    color: cores.textoSecundario,
    lineHeight: 20,
  },
  logCampo: {
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  vazio: {
    fontSize: 13,
    color: cores.textoTerciario,
  },
  acoes: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  botaoAcao: {
    flex: 1,
  },
});
