# StockFlow — Controle de Estoque & Frente de Caixa Móvel

Aplicativo móvel completo para gestão de estoque, controle de lotes, catálogo de produtos e frente de caixa (PDV) desenvolvido em React Native com Expo e TypeScript. O projeto foi construído como solução para o Exame de Suficiência da disciplina de Programação para Dispositivos Móveis (PDM) e expandido com módulos avançados de operações comerciais.

---

## Demonstração em Vídeo
- **Link da Defesa em Vídeo:** [Assistir no Google Drive](https://drive.google.com/file/d/1l6-zk-J8-KbHcNZ0-mYz5Ef35eS9dS-e/view?usp=sharing)
> Vídeo de até 15 minutos apresentando a aplicação em execução e demonstrando o cumprimento de cada um dos 10 requisitos da avaliação.

---

## Módulos da Aplicação

### 1. Dashboard Executivo & Acolhimento Animado
- **Tela de Acolhimento e Loading:** sequência animada suave exibindo saudação personalizada com o nome do operador ("Bom dia, Ricardo!"), seguida da transição "Estamos preparando o seu ambiente..." antes de abrir os indicadores.
- **Métricas do Dia em Tempo Real:** total de vendas faturadas hoje (R$), ticket médio por venda, contagem de itens vendidos e pedidos aguardando no caixa.
- **Vendas em Nome do Operador:** indicador dedicado registrando o volume de pedidos e valor total vendido em nome do usuário no dia.
- **Vendas por Meio de Pagamento:** divisão analítica e barras percentuais para PIX, Cartão de Crédito, Cartão de Débito e Dinheiro.
- **Alertas Operacionais & Ações Rápidas:** cartões de atenção para produtos com estoque crítico (< 5 un.), lotes vencidos/a vencer e atalhos rápidos para Frente de Caixa, Produtos e Vendas.
- **Pedidos Recentes de Hoje:** lista dos atendimentos finalizados no dia com cliente, horário, valor e status de pagamento.

### 2. Autenticação e Sessão
- Fluxo de login com autenticação de usuário e chave de acesso.
- Persistência segura de credenciais localmente no dispositivo via `AsyncStorage`.
- Controle automático de rotas protegidas sem flash visual na inicialização.
- Encerramento de sessão (Logout) com limpeza total do armazenamento.

### 3. Catálogo de Produtos & Inventário
- **Paginação Real no Servidor:** consumo otimizado via `FlatList` com paginação remota e scroll infinito (`onEndReached`).
- **Busca e Autocomplete:** campo de pesquisa com *debounce* de 350ms e sugestões em tempo real vindas do servidor.
- **Filtros por Status:** chips com rolagem horizontal para filtrar todos, ativos, disponíveis para venda, sem estoque, inativos ou com lotes perto do vencimento.
- **Card de Produto Otimizado:** exibição clara de nome, categoria, código de barras EAN, quantidade e preço formatado em BRL.
- **Menu de Ações Flutuante (`⋮`):** ações rápidas de Visualizar, Editar e Excluir com elevação de `z-index` e diálogo de confirmação destrutiva.
- **Indicadores Inteligentes de Estoque:** badges visuais para estoque crítico (< 5 un.), baixo (< 20 un.), normal e alerta de lote vencido ou próximo do vencimento.

### 4. Cadastro e Edição com Formulário Avançado
- Validação reativa em tempo real com feedback visual imediato abaixo de cada campo inconsistente.
- Máscara monetária em centavos para Preço de Venda e Preço de Custo.
- Cálculo de margem estimada em tempo real em relação à margem alvo padrão (40%).
- Gerador automático de código de barras padrão EAN (13 dígitos).
- Gerenciamento de categorias personalizadas com ícones em emoji.
- Chave seletora (`Switch`) para ativação/desativação do produto no catálogo.
- Histórico de edições (Log de-para): rastreamento de alterações com data e comparação de valores anteriores e novos.

### 5. Gestão de Estoque por Lotes & Validade
- **Tabela de Rastreabilidade:** visualização de lotes com código, quantidade de entrada, saldo restante e custo unitário.
- **Custo Médio Ponderado:** cálculo automático da média ponderada de custo dos lotes ativos exibido na ficha do produto.
- **Entrada de Estoque / Novo Lote:** tela dedicada para dar entrada em mercadorias com gerador de código de lote e switch "Não expira".
- **Calendário Customizado (`SeletorData`):** seletor de data próprio em React Native puro (sem quebra cross-platform) com regras visuais de validade (aviso âmbar para itens vencendo em até 30 dias e vermelho para lotes vencidos).
- **Simulador de Margem na Entrada:** alerta quando o custo do novo lote reduz a margem abaixo do alvo, sugerindo novo preço de venda com opção de atualizar o catálogo automaticamente.

### 6. Frente de Caixa (PDV) & Pedidos
- Painel de caixa com fila de pedidos aguardando pagamento e atendimento.
- **Conferência e Edição de Pedido:** tela dedicada (`pedido-caixa.tsx`) para identificação do cliente, adição e remoção de itens com controle de estoque.
- **Descontos Flexíveis:** aplicação de desconto tanto por porcentagem (`%`) quanto por valor fixo (`R$`).
- **Múltiplos Meios de Pagamento:** suporte a PIX, Cartão de Crédito, Cartão de Débito e Dinheiro em espécie.
- Observações adicionais do pedido salvas no registro da venda.

### 7. Cobrança PIX & Integração com WhatsApp
- Geração dinâmica de QR Code PIX fictício em formato vetorial SVG (`qrcode` + `react-native-svg`).
- Botão para cópia rápida do código PIX Copia e Cola.
- Animação de conferência e simulação de confirmação instantânea de recebimento.
- Envio direto da mensagem de cobrança com os dados do pedido para o WhatsApp do cliente via `Linking` do React Native (abre em nova aba no navegador, sem sair do app).

### 8. Comprovante de Venda em PDF
- Geração de cupom fiscal/comprovante estilizado em PDF a partir de template HTML responsivo (`expo-print`).
- Compartilhamento nativo do arquivo PDF gerado (`expo-sharing`) por e-mail, WhatsApp ou salvamento no dispositivo.

### 9. Gestão de Clientes
- Cadastro de clientes com validação e máscaras de CPF e Telefone.
- Aba "Já comprou": histórico de compras anteriores do cliente identificado exibido durante o atendimento na tela de vendas.

### 10. Histórico de Pedidos & Baixa de Estoque
- Filas de pedidos Aguardando, Pagos e Cancelados no caixa, com histórico de eventos de cada pedido (criado, editado, pago, cancelado, reaberto).
- Baixa automática no estoque geral e nos lotes por FEFO (validade mais próxima primeiro), com estorno ao cancelar ou editar o pedido.

### 11. Design System, Tema Escuro e Navegação
- **Modo Claro / Modo Escuro (Dark Mode):** alternância com persistência de preferência via `TemaContext` e paleta com tokens unificados.
- **Notificações Toast:** feedback flutuante animado via `ToastContext` para ações de sucesso ou aviso.
- **Menu Lateral (Drawer):** menu animado customizado para alternar entre Módulos (Produtos, Caixa, Vendas), consultar dados do operador e alternar tema.
- **Conformidade de UX/Acessibilidade:** alvos de toque mínimos de 44px (Apple HIG / Material Design), suporte a leitor de tela (`accessibilityRole`/`accessibilityLabel`), `KeyboardAvoidingView` para evitar oclusão por teclado e contraste validado (WCAG AA).

---

## Tecnologias e Bibliotecas

- [Expo](https://expo.dev/) (SDK 57)
- [React Native](https://reactnative.dev/) (v0.86 / React 19)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (Navegação baseada em arquivos com rotas protegidas)
- [Context API](https://react.dev/reference/react/createContext) (`AuthContext`, `TemaContext`, `ToastContext`)
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) (Persistência local)
- [Axios](https://axios-http.com/) (Cliente HTTP para API REST)
- [expo-print](https://docs.expo.dev/versions/latest/sdk/print/) (Geração de PDFs de comprovante de venda)
- [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) (Compartilhamento nativo de arquivos)
- [qrcode](https://www.npmjs.com/package/qrcode) & [react-native-svg](https://github.com/software-mansion/react-native-svg) (Renderização de QR Code PIX vetorial)
- [@expo/vector-icons](https://icons.expo.fyi/) (Ícones Ionicons)

---

## Cobertura dos 10 Requisitos da Avaliação

1. **Arquitetura de Rotas e Navegação com Expo Router:** Divisão entre fluxo público (`src/app/(auth)/login.tsx`) e fluxo protegido (`src/app/(app)/index.tsx`, `src/app/(app)/novo-produto.tsx`, etc.), com transições via `useRouter` e controle por `Stack.Protected`.
2. **Gerenciamento de Estado Global com Context API:** Implementação do `AuthContext` na raiz do app para controle de sessão sem prop drilling.
3. **Persistência de Sessão com AsyncStorage:** Gravação e recuperação automática de credenciais e limpeza dos dados no logout.
4. **Componentização Reutilizável e Tipagem com Props:** Componentes próprios tipados com TypeScript (`CustomInput`, `CustomButton` e `ProductCard`), sem o uso do componente `Button` rígido nativo.
5. **Formulário Controlado com Validação e Switch:** 3 campos controlados via `useState`, 1 `Switch` para status de ativação do produto e mensagens de erro visuais abaixo dos campos.
6. **Ciclo de Vida e Reatividade com Hooks (useEffect):** Efeito de montagem para inicialização de dados da API/Storage e efeito de monitoramento para validação de campos em tempo real.
7. **Consumo Otimizado com FlatList e Axios (GET):** Requisição remota com exibição via `FlatList`, chaves exclusivas via `keyExtractor`, tratamento de `ListEmptyComponent` e estilização estruturada com cards.
8. **Operações Remotas de Escrita e Exclusão (POST e DELETE):** Criação de produtos via formulário e exclusão direta através da lista.
9. **Tratamento de Estados Visuais:** Componente `ActivityIndicator` durante processos assíncronos e diálogos de feedback via `Alert.alert`.
10. **Layout Seguro, Flexbox e StyleSheet:** Estruturas seguras com `SafeAreaView` e `ScrollView`, identidade visual via `Image`, posicionamento com Flexbox e estilos 100% isolados via `StyleSheet.create` (sem estilos inline).

---

## Estrutura do Projeto

```text
src/
├── app/
│   ├── _layout.tsx                  # Ponto de entrada raiz com Stack.Protected e Providers
│   ├── (auth)/
│   │   ├── _layout.tsx              # Stack público
│   │   └── login.tsx                # Tela de autenticação com logo e inputs controlados
│   └── (app)/
│       ├── _layout.tsx              # Stack protegido
│       ├── index.tsx                # Catálogo de produtos com paginação, busca e filtros
│       ├── dashboard.tsx            # Dashboard com acolhimento animado e métricas do dia
│       ├── novo-produto.tsx         # Formulário de cadastro de novo item
│       ├── editar-produto.tsx       # Edição com log de alterações
│       ├── visualizar-produto.tsx   # Ficha completa em abas (Produto, Lotes, Log)
│       ├── adicionar-estoque.tsx    # Entrada de lote, seletor de data e simulador de margem
│       ├── caixa.tsx                # Fila do caixa: aguardando, pagos e cancelados
│       ├── pedido-caixa.tsx         # Conferência/edição do pedido, PIX, recebimento e comprovante
│       └── vendas.tsx               # PDV: catálogo, carrinho, cliente e aba "Já comprou"
├── components/
│   ├── CustomButton/                # Botão interativo com loading e variantes
│   ├── CustomInput/                 # Input controlado com label, erro visual e contador
│   ├── ProductCard/                 # Card compacto com menu de 3 pontinhos
│   ├── ProdutoForm/                 # Formulário com validação reativa e máscara de preço
│   ├── FiltroProdutos/              # Busca com debounce, autocomplete e select de status
│   ├── TabelaLotes/                 # Grade de lotes com selos de validade
│   ├── SeletorData/                 # Calendário nativo puro com regras de vencimento
│   ├── PagamentoPix/                # QR Code PIX animado com WhatsApp
│   ├── EditorPedido/                # Gestor de itens, descontos e pagamento
│   ├── MenuLateral/                 # Drawer com tema, usuário e navegação
│   ├── ModalCategoria/              # Criação e seleção de categorias
│   ├── FormularioCliente/           # Cadastro de cliente com CPF/telefone
│   ├── ModalCliente/                # Modal de seleção com histórico "Já comprou"
│   ├── Toast/                       # Alerta visual flutuante temporizado
│   └── BarraTopo/                   # Cabeçalho com botão voltar
├── constants/
│   ├── theme.ts                     # Tokens de design (cores claro/escuro, espaçamento, raios)
│   ├── loja.ts                      # Dados institucionais e chave PIX da loja
│   └── usuario.ts                   # Dados do operador da sessão
├── contexts/
│   ├── AuthContext.tsx              # Sessão global e persistência no AsyncStorage
│   ├── TemaContext.tsx              # Alternância entre tema claro e escuro
│   └── ToastContext.tsx             # Disparador global de notificações toast
├── hooks/
│   └── useCampoMoeda.ts             # Hook reutilizável de máscara de moeda em centavos
├── services/
│   ├── api.ts                       # Instância Axios centralizada com timeout
│   ├── produtos.ts                  # Métodos REST de produtos e lotes
│   ├── categorias.ts                # Métodos REST de categorias
│   ├── clientes.ts                  # Métodos REST de clientes
│   ├── vendas.ts                    # Métodos REST de vendas e pedidos
│   └── comprovante.ts               # Geração de PDF e compartilhamento
├── styles/                          # 100% dos estilos isolados via StyleSheet.create
├── types/                           # Contratos TypeScript para todas as entidades
└── utils/                           # Utilitários de moeda, data, lotes, estoque, PIX e PDF
```

---

## Como Executar

### 1. Pré-requisitos
- Node.js instalado (v18+)
- Gerenciador de pacotes `npm` ou `bun`

### 2. Instalação das dependências
```bash
npm install
```

### 3. Executando o backend mock (JSON-Server)
O backend mock já vem incluído no projeto e roda a partir do arquivo `db.json`:
```bash
npm run mock-api
```
A API ficará acessível em `http://localhost:3000` (ou no IP local da sua rede via porta 3000).

### 4. Iniciando o aplicativo Expo
Em outro terminal:
```bash
npx expo start
```
- Pressione **`w`** para abrir no navegador web.
- Pressione **`a`** para abrir no emulador Android ou **`i`** para simulador iOS.
- Ou escaneie o QR Code no aplicativo **Expo Go** em um smartphone conectado na mesma rede Wi-Fi.

---

## Configuração do Backend (Variáveis de Ambiente)

Por padrão, a aplicação aponta para `http://localhost:3000`. Para apontar para outra API ou acessar através de um dispositivo físico na rede local:

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
2. Configure o IP da máquina na rede local:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
   ```
3. Reinicie o servidor Expo (`npx expo start`) após editar o `.env`.

> Variáveis `EXPO_PUBLIC_*` são embutidas no bundle na hora da compilação, não lidas em tempo de execução. Por isso é preciso reiniciar o Expo depois de mudar o `.env`.

### Acessando de outro dispositivo na rede (celular físico, outra máquina)
Se você abrir o app pelo IP da máquina na rede (ex.: `http://192.168.x.x:8081`) em vez de `localhost`, duas coisas precisam mudar:

1. O `json-server` precisa escutar em todas as interfaces, não só em `localhost`. O script `npm run mock-api` já faz isso (`--host 0.0.0.0`).
2. O app precisa apontar para o IP da máquina, não para `localhost` (que, do ponto de vista do outro dispositivo, é ele mesmo). Defina `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000` no `.env` e reinicie `npx expo start`.
