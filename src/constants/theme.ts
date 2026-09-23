import { Platform, type ViewStyle } from "react-native";

export const coresClaro = {
  fundo: "#F8FAFC",
  superficie: "#FFFFFF",
  superficieAlternativa: "#F8FAFC",
  borda: "#E2E8F0",
  bordaSuave: "#F1F5F9",

  textoPrimario: "#0F172A",
  textoSecundario: "#475569",
  textoTerciario: "#64748B",
  textoSobreCor: "#FFFFFF",

  primaria: "#4F46E5",
  primariaForte: "#4338CA",
  botaoPrimario: "#4F46E5",
  botaoSucesso: "#059669",
  primariaFundo: "#EEF2FF",
  primariaFundoForte: "#C7D2FE",

  perigo: "#E11D48",
  perigoFundo: "#FFF1F2",
  perigoBorda: "#FECDD3",

  sucesso: "#047857",
  sucessoFundo: "#ECFDF5",
  sucessoBorda: "#A7F3D0",

  alerta: "#B45309",
  alertaFundo: "#FFFBEB",
  alertaBorda: "#FDE68A",

  neutroFundo: "#F1F5F9",
  neutroFundoForte: "#E2E8F0",
  neutroTexto: "#334155",

  desabilitado: "#CBD5E1",

  overlay: "#0F172A",
  overlayTranslucido: "rgba(15, 23, 42, 0.6)",
  toastFundo: "#0F172A",
  toastTexto: "#FFFFFF",
  qrFundo: "#FFFFFF",
  qrModulo: "#000000",
} as const;

export type Cores = Record<keyof typeof coresClaro, string>;

export const coresEscuro: Cores = {
  fundo: "#0F172A",
  superficie: "#1E293B",
  superficieAlternativa: "#162033",
  borda: "#334155",
  bordaSuave: "#243044",

  textoPrimario: "#F8FAFC",
  textoSecundario: "#CBD5E1",
  textoTerciario: "#94A3B8",
  textoSobreCor: "#FFFFFF",

  primaria: "#818CF8",
  primariaForte: "#4F46E5",
  botaoPrimario: "#4F46E5",
  botaoSucesso: "#059669",
  primariaFundo: "#1E1B4B",
  primariaFundoForte: "#3730A3",

  perigo: "#FB7185",
  perigoFundo: "#3B1520",
  perigoBorda: "#881337",

  sucesso: "#6EE7B7",
  sucessoFundo: "#0B2E24",
  sucessoBorda: "#065F46",

  alerta: "#FCD34D",
  alertaFundo: "#33250B",
  alertaBorda: "#78350F",

  neutroFundo: "#283548",
  neutroFundoForte: "#334155",
  neutroTexto: "#E2E8F0",

  desabilitado: "#475569",

  overlay: "#000000",
  overlayTranslucido: "rgba(0, 0, 0, 0.75)",
  toastFundo: "#F8FAFC",
  toastTexto: "#0F172A",
  qrFundo: "#FFFFFF",
  qrModulo: "#000000",
};

export type ModoTema = "claro" | "escuro";

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
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const ALVO_TOQUE_MINIMO = 44;

export const fonteMono = Platform.select({ ios: "Menlo", default: "monospace" });

export const sombra = {
  cartao: {
    boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.06)",
  } satisfies ViewStyle,
  botao: {
    boxShadow: "0px 10px 20px rgba(79, 70, 229, 0.28)",
  } satisfies ViewStyle,
  botaoSucesso: {
    boxShadow: "0px 10px 20px rgba(5, 150, 105, 0.28)",
  } satisfies ViewStyle,
  flutuante: {
    boxShadow: "0px 12px 28px rgba(15, 23, 42, 0.16)",
  } satisfies ViewStyle,
};
