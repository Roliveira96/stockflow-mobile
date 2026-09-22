import { StyleSheet } from "react-native";

import { cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: cores.textoPrimario,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 24,
  },
  carregando: {
    marginTop: 40,
  },
  linhaCodigo: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  campoCodigo: {
    flex: 1,
  },
  botaoGerar: {
    height: 44,
    marginBottom: 18,
    paddingHorizontal: 14,
    borderRadius: raios.sm,
    backgroundColor: cores.primariaFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoGerarTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.primaria,
  },
  linhaSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  rotuloSwitch: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
  simulador: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: 18,
    marginBottom: 20,
    ...sombra.cartao,
  },
  simuladorTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: cores.textoPrimario,
    marginBottom: 12,
  },
  simuladorLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  simuladorRotulo: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  simuladorValor: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  simuladorValorAlerta: {
    color: cores.perigo,
  },
  simuladorValorOk: {
    color: cores.sucesso,
  },
  sugestaoCaixa: {
    marginTop: 8,
    padding: 12,
    borderRadius: raios.sm,
    backgroundColor: cores.primariaFundo,
  },
  sugestaoTexto: {
    fontSize: 13,
    color: cores.textoSecundario,
    lineHeight: 19,
  },
  sugestaoDestaque: {
    fontWeight: "800",
    color: cores.primaria,
  },
  linhaCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  checkboxTexto: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
});
