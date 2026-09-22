import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  ativo: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  carregandoSessao: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface CustomInputProps extends TextInputProps {
  label: string;
  erro?: string;
}

export interface CustomButtonProps {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  estiloContainer?: StyleProp<ViewStyle>;
}

export interface ProductCardProps {
  produto: Produto;
  onExcluir: (id: string) => void;
}
