import { StyleSheet } from "react-native";

import { cores, raios, sombra } from "@/constants/theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: raios.md,
    backgroundColor: cores.superficie,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    position: "relative",
    zIndex: 1,
    ...sombra.cartao,
  },
  cardMenuAberto: {
    zIndex: 20,
  },
  conteudo: {
    flex: 1,
    paddingRight: 8,
  },
  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  nome: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: cores.textoPrimario,
  },
  preco: {
    fontSize: 15,
    fontWeight: "800",
    color: cores.primaria,
  },
  linhaDetalhes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
  },
  detalheTexto: {
    flex: 1,
    fontSize: 12,
    color: cores.textoTerciario,
  },
  selos: {
    flexDirection: "row",
    gap: 4,
  },
  selo: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: raios.pill,
    backgroundColor: cores.sucessoFundo,
  },
  seloInativo: {
    backgroundColor: cores.neutroFundo,
  },
  seloTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: cores.sucesso,
  },
  seloTextoInativo: {
    color: cores.textoTerciario,
  },
  seloAlerta: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: raios.pill,
    backgroundColor: cores.alertaFundo,
  },
  seloTextoAlerta: {
    fontSize: 10,
    fontWeight: "700",
    color: cores.alerta,
  },
  menuContainer: {
    position: "relative",
  },
  botaoMenu: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  menuPainel: {
    position: "absolute",
    top: 30,
    right: 0,
    width: 168,
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    overflow: "hidden",
    zIndex: 30,
    ...sombra.flutuante,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 44,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
  },
  menuItemUltimo: {
    borderBottomWidth: 0,
  },
  menuItemTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
  menuItemTextoPrimaria: {
    color: cores.primaria,
  },
  menuItemTextoPerigo: {
    color: cores.perigo,
  },
});
