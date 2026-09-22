import type Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

export type NomeIcone = ComponentProps<typeof Ionicons>["name"];

export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  ativo: boolean;
  codigoBarras: string;
  descricao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type DadosProduto = Omit<Produto, "id" | "criadoEm" | "atualizadoEm">;

export interface AlteracaoCampo {
  campo: string;
  de: string;
  para: string;
}

export interface LogEdicao {
  id: string;
  produtoId: string;
  produtoNome: string;
  data: string;
  alteracoes: AlteracaoCampo[];
}

export interface Lote {
  id: string;
  produtoId: string;
  codigo: string;
  validade: string | null;
  quantidadeEntrada: number;
  saldoRestante: number;
  custoUnitario: number;
  criadoEm: string;
}

export type DadosLote = {
  codigo: string;
  validade: string | null;
  quantidadeEntrada: number;
  custoUnitario: number;
};

export type StatusLote = "regular" | "vencendo" | "vencido";

export interface TabelaLotesProps {
  lotes: Lote[];
}

export interface SeletorDataProps {
  label: string;
  valor: string | null;
  onSelecionar: (iso: string) => void;
  erro?: string;
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

export type VarianteBotao = "primaria" | "perigo" | "neutro";

export interface CustomButtonProps {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  estiloContainer?: StyleProp<ViewStyle>;
  icone?: NomeIcone;
  variante?: VarianteBotao;
}

export interface ProductCardProps {
  produto: Produto;
  onExcluir: (id: string) => void;
  onEditar: (id: string) => void;
  onVisualizar: (id: string) => void;
}

export interface ProdutoFormProps {
  valoresIniciais?: Produto;
  enviando: boolean;
  textoBotao: string;
  aoEnviar: (dados: DadosProduto) => void;
}

export type StatusFiltro = "todos" | "ativos" | "sem-estoque" | "inativos";

export interface FiltroProdutosProps {
  produtos: Produto[];
  busca: string;
  aoMudarBusca: (texto: string) => void;
  filtroStatus: StatusFiltro;
  aoMudarFiltroStatus: (status: StatusFiltro) => void;
}
