import type Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ReactNode } from "react";
import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

import type { Cores, ModoTema } from "@/constants/theme";

export type NomeIcone = ComponentProps<typeof Ionicons>["name"];

export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  precoCusto?: number;
  ativo: boolean;
  codigoBarras: string;
  codigoAuxiliar?: string;
  descricao?: string;
  categoria?: string;
  categoriaIcone?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  descricao?: string;
}

export type DadosCategoria = Omit<Categoria, "id">;

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

export interface LoteComPrazo {
  lote: Lote;
  diasParaVencer: number;
}

export interface ResumoVencimento {
  lotesVencendo: LoteComPrazo[];
  lotesVencidos: LoteComPrazo[];
  unidadesVencendo: number;
  unidadesVencidas: number;
  menorPrazoDias: number | null;
}

export interface SeletorDataProps {
  label: string;
  valor: string | null;
  onSelecionar: (iso: string) => void;
  erro?: string;
}

export interface MenuLateralProps {
  visivel: boolean;
  aoFechar: () => void;
  nomeUsuario: string;
  emailUsuario: string;
  cargoUsuario: string;
  aoSair: () => void;
  telaAtiva: "produtos" | "vendas" | "caixa";
  aoAbrirCategorias?: () => void;
  totalProdutos?: number;
  totalCategorias?: number;
  pedidosPendentes?: number;
}

export interface TemaContextData {
  modo: ModoTema;
  cores: Cores;
  alternarTema: () => void;
}

export interface BarraTopoProps {
  rotuloVoltar: string;
  aoVoltar: () => void;
  direita?: ReactNode;
}

export interface ToastProps {
  mensagem: string | null;
}

export interface ToastContextData {
  mostrarToast: (mensagem: string) => void;
}

export interface ModalCategoriaProps {
  visivel: boolean;
  aoFechar: () => void;
  aoCriar: (categoria: Categoria) => void;
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
  obrigatorio?: boolean;
  contador?: string;
  monoespacado?: boolean;
}

export type VarianteBotao = "primaria" | "sucesso" | "perigo" | "neutro";

export interface CustomButtonProps {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  estiloContainer?: StyleProp<ViewStyle>;
  icone?: NomeIcone;
  variante?: VarianteBotao;
  compacto?: boolean;
}

export interface ProductCardProps {
  produto: Produto;
  onExcluir: (id: string) => void;
  onEditar: (id: string) => void;
  onVisualizar: (id: string) => void;
  menuAberto: boolean;
  aoAlternarMenu: () => void;
  vencimento?: ResumoVencimento;
}

export interface ProdutoFormProps {
  valoresIniciais?: Produto;
  enviando: boolean;
  textoBotao: string;
  aoEnviar: (dados: DadosProduto) => void;
}

export type NivelEstoque = "critico" | "baixo" | "normal";

export type StatusFiltro =
  | "todos"
  | "disponiveis"
  | "vencendo"
  | "ativos"
  | "sem-estoque"
  | "inativos";

export interface FiltroProdutosProps {
  sugestoes: Produto[];
  busca: string;
  aoMudarBusca: (texto: string) => void;
  filtroStatus: StatusFiltro;
  aoMudarFiltroStatus: (status: StatusFiltro) => void;
  totalFiltrado: number;
}

export interface RespostaPaginada<T> {
  itens: T[];
  paginaAtual: number;
  itensPorPagina: number;
  totalItens: number;
  quantidadeNaPagina: number;
  filtro: string;
  ehPrimeiraPagina: boolean;
  ehUltimaPagina: boolean;
}

export type FormaPagamento = "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "DINHEIRO";

export type StatusPedido = "AGUARDANDO" | "PAGO" | "CANCELADO";

export type TipoEventoPedido = "criado" | "pago" | "cancelado" | "reaberto" | "editado";

export interface EventoPedido {
  tipo: TipoEventoPedido;
  data: string;
  responsavel: string;
  motivo?: string;
  descricao?: string;
}

export type TipoDesconto = "percentual" | "valor";

export interface Cliente {
  nome: string;
  cpf?: string;
  telefone?: string;
}

export interface ClienteCadastrado extends Cliente {
  id: string;
  cpf: string;
  criadoEm: string;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export interface BaixaLote {
  loteId: string;
  codigo: string;
  quantidade: number;
}

export interface ItemPedido {
  produtoId: string;
  nome: string;
  icone: string;
  precoUnitario: number;
  quantidade: number;
  embalado: boolean;
  lotes: BaixaLote[];
}

export interface ItemBalcao {
  nome: string;
  preco: number;
}

export interface Pedido {
  id: string;
  numero: string;
  criadoEm: string;
  vendedor: string;
  cliente: Cliente;
  itens: ItemPedido[];
  itensBalcao: ItemBalcao[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: FormaPagamento;
  status: StatusPedido;
  pagoEm: string | null;
  motivoCancelamento?: string | null;
  observacao?: string;
  eventos: EventoPedido[];
}

export interface ItemRascunho {
  produtoId: string;
  nome: string;
  icone: string;
  precoUnitario: number;
  quantidade: number;
}

export interface RascunhoPedido {
  itens: ItemRascunho[];
  itensBalcao: ItemBalcao[];
  cliente: Cliente;
  formaPagamento: FormaPagamento;
  desconto: number;
  observacao: string;
}

export interface EditorPedidoProps {
  pedido: Pedido;
  operador: string;
  aoSalvar: (pedido: Pedido) => void;
  aoDescartar: () => void;
}

export interface FormularioClienteProps {
  clienteAtual: Cliente | null;
  aoConfirmar: (cliente: Cliente | null) => void;
  aoCancelar: () => void;
}

export interface NovoPedido {
  itens: ItemCarrinho[];
  cliente: Cliente;
  desconto: number;
  formaPagamento: FormaPagamento;
  vendedor: string;
}

export interface SeletorQuantidadeProps {
  quantidade: number;
  maximo?: number;
  aoAumentar: () => void;
  aoDiminuir: () => void;
  compacto?: boolean;
}

export interface CardProdutoVendaProps {
  produto: Produto;
  quantidadeNoCarrinho: number;
  aoAumentar: () => void;
  aoDiminuir: () => void;
  aoAbrirFicha: () => void;
}

export interface ModalFichaProdutoProps {
  produto: Produto | null;
  aoFechar: () => void;
  aoAdicionar: (produto: Produto) => void;
}

export interface ModalClienteProps {
  visivel: boolean;
  clienteAtual: Cliente | null;
  aoFechar: () => void;
  aoConfirmar: (cliente: Cliente | null) => void;
}

export interface CardPedidoProps {
  pedido: Pedido;
  aoAbrir: () => void;
}


export interface FolhaInferiorProps {
  visivel: boolean;
  aoFechar: () => void;
  titulo: ReactNode;
  subtitulo?: ReactNode;
  icone?: NomeIcone;
  children: ReactNode;
  rodape?: ReactNode;
}

export interface SugestoesClienteProps {
  sugestoes: ClienteCadastrado[];
  aoSelecionar: (cliente: ClienteCadastrado) => void;
}

export interface QrCodeProps {
  valor: string;
  tamanho: number;
}

export interface PagamentoPixProps {
  valor: number;
  numeroPedido: string;
}
