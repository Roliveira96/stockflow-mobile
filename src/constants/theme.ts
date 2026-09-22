import type { ViewStyle } from "react-native";

export const cores = {
  fundo: "#F5F5FF",
  superficie: "#FFFFFF",
  borda: "#EAEAF5",

  textoPrimario: "#151328",
  textoSecundario: "#4B4870",
  textoTerciario: "#6E6B94",
  textoSobreCor: "#FFFFFF",

  primaria: "#6C5CE7",
  primariaClara: "#8B7CF6",
  primariaFundo: "#EDEAFE",

  perigo: "#F0335C",
  perigoFundo: "#FDE7ED",

  sucesso: "#12B76A",
  sucessoFundo: "#E1FAEF",

  alerta: "#B45B00",
  alertaFundo: "#FFF1DB",

  neutroFundo: "#F0F0FA",
  neutroTexto: "#4B4870",

  desabilitado: "#C4C2DB",
} as const;

export const gradientes = {
  primaria: [cores.primaria, cores.primariaClara] as [string, string],
  perigo: [cores.perigo, "#FF6B93"] as [string, string],
  neutro: [cores.textoSecundario, cores.textoTerciario] as [string, string],
  desabilitado: [cores.desabilitado, cores.desabilitado] as [string, string],
};

export const espacamento = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const raios = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const ALVO_TOQUE_MINIMO = 44;

export const sombra = {
  cartao: {
    boxShadow: "0px 8px 16px rgba(43, 37, 96, 0.08)",
  } satisfies ViewStyle,
  botao: {
    boxShadow: "0px 6px 12px rgba(108, 92, 231, 0.28)",
  } satisfies ViewStyle,
  flutuante: {
    boxShadow: "0px 4px 10px rgba(43, 37, 96, 0.10)",
  } satisfies ViewStyle,
};
