import { StyleSheet } from "react-native";

import { cores, raios, sombra } from "@/constants/theme";

export const LARGURA_MENU = 280;

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#151328",
    zIndex: 20,
  },
  overlayPressable: {
    flex: 1,
  },
  painel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: LARGURA_MENU,
    backgroundColor: cores.superficie,
    paddingTop: 24,
    paddingHorizontal: 20,
    zIndex: 21,
    ...sombra.cartao,
  },
  cabecalhoUsuario: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: raios.pill,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
  },
  nomeUsuario: {
    fontSize: 16,
    fontWeight: "800",
    color: cores.textoPrimario,
  },
  menuLista: {
    flex: 1,
  },
  itemMenu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: raios.sm,
  },
  itemMenuAtivo: {
    backgroundColor: cores.primariaFundo,
  },
  itemMenuTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: cores.textoSecundario,
  },
  itemMenuTextoAtivo: {
    color: cores.primaria,
  },
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 24,
    borderRadius: raios.sm,
  },
  botaoSairTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: cores.perigo,
  },
});
