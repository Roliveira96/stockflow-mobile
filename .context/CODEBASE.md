# Status do Codebase: StockFlow

> Documento vivo — atualizado a cada etapa de implementação. Ver regras em `.context/ARCHITECTURE.md` e a spec em `.context/phase/22-09-26-spec-stockflow-mobile-app.md`.

## Fase Atual
**Fase 1 concluída.** Todos os 11 arquivos da ordem de execução da spec (seção 9) foram criados. `npx tsc --noEmit` e `npx expo lint` passam sem erros.
**Fase 2 concluída.** Backend mock (`json-server`) configurado e testado manualmente (GET/POST/DELETE em `/produtos` confirmados). Fluxo completo (login → listar → criar → ver na lista) validado ponta a ponta com Playwright headless contra o dev server web real.
**Fase 3 concluída.** Funcionalidades além da spec original, pedidas pelo usuário: editar produto, código de barras, descrição, máscara de preço em centavos, selo de "últimas unidades", busca com autocomplete e filtro por status. Ver seção própria abaixo.
**Fase 4 concluída.** Tela de visualização de produto, campos `criadoEm`/`atualizadoEm`, e log de alterações (de/para) a cada edição. Validado com edição real feita pelo próprio usuário durante o desenvolvimento.
**Fase 5 concluída.** Passada de UX/UI orientada por heurísticas conhecidas (Nielsen, WCAG, Apple HIG/Material Design). Ver seção própria abaixo.
**Fase 6 concluída.** Redesign visual completo: usuário achou a Fase 5 "extremamente feia". Nova direção "moderno/vibrante" (paleta roxa, gradientes, cards flutuantes com sombra, botões de ação em círculo). Ver seção própria abaixo.
**Fase 7 concluída.** Gestão de estoque por lote (o que estava no backlog da Fase 6) — tabela de lotes no detalhe do produto, tela "Adicionar Estoque" com simulador de margem em tempo real. Ver seção própria abaixo.
**Fase 8 concluída.** Calendário próprio para validade de lote com regras de vencido/vencendo. Menu lateral (drawer) com nome mocado e navegação. Correção de bug real (`FlatList` sem `flex:1`, lista ficava curta no celular). Listagem de produtos migrada para paginação real do servidor com scroll infinito. Ver seções próprias abaixo.
**Fase 9 concluída.** Redesign a partir de um protótipo HTML/Tailwind entregue pelo usuário: paleta indigo/slate, tema claro/escuro, categorias, toast, formulários em blocos. Ver seção "Redesign pelo Protótipo (Fase 9)" abaixo.

## Bug Corrigido: produto criado não aparecia na lista
**Sintoma relatado pelo usuário:** "criei um produto e não aconteceu nada". **Causa raiz:** `src/app/(app)/index.tsx` buscava produtos só no `useEffect` de montagem; como `router.back()` a partir de `novo-produto.tsx` não remonta a tela (mesma instância na pilha do `Stack`), a lista nunca era recarregada — o `POST` funcionava (confirmado via log de rede: `201`), só a UI ficava desatualizada. **Correção:** troquei o `useEffect` por `useFocusEffect` (importado de `expo-router`, confirmado via docs oficiais), que roda tanto na montagem quanto toda vez que a tela reganha foco — cobre login inicial, volta do formulário e volta depois de excluir.

## Decisão de Implementação: Autenticação
A spec (seção 5) só define contrato de API para `produtos` (GET/POST/DELETE); não há endpoint de autenticação especificado. Assumindo que o login é validado localmente no `AuthContext` (campos não vazios) e um token é gerado no cliente para fins do exame, já que não há backend de auth definido. Ajustar se um contrato real de login surgir.

## Configuração de Ambiente
`src/services/api.ts` lê `EXPO_PUBLIC_API_URL` (padrão Expo para variáveis públicas). Sem esse valor definido em `.env`, cai para `http://localhost:3000` (porta padrão do `json-server`). `.env` está no `.gitignore` (valor é específico da máquina/rede de cada um); `.env.example` documenta a variável e fica versionado.

## Bug Corrigido: acesso via IP de rede (outra máquina/dispositivo)
**Sintoma:** app acessado via `http://192.168.x.x:8095` (IP da máquina na rede, não `localhost`) não conseguia falar com a API. **Causa raiz (dois problemas):** (1) `json-server` escutava só em `127.0.0.1`, inacessível de fora da própria máquina; (2) o fallback `http://localhost:3000` em `src/services/api.ts`, do ponto de vista do dispositivo remoto, aponta pra ele mesmo, não para o host rodando o mock. **Correção:** `npm run mock-api` agora roda com `--host 0.0.0.0`; `.env` local aponta `EXPO_PUBLIC_API_URL` para o IP de rede da máquina host. Documentado no README ("Acessando de outro dispositivo na rede").

## Nota de Convenção
A spec (seção 9) referencia caminhos como `app/_layout.tsx`, `app/(auth)/...`, `app/(app)/...`. Este projeto usa **`src/app/`** como raiz de rotas (Expo Router), conforme `AGENTS.md` e a estrutura real do repositório. Todos os caminhos da spec devem ser lidos com o prefixo `src/` adicionado.

## Desvio de Caminho: arquivos `styles.ts` das telas
A spec pede `styles.ts`/`novo-produto.styles.ts` **dentro** de `src/app/(auth)/` e `src/app/(app)/`. Isso quebra o Expo Router: qualquer arquivo dentro de `src/app/` é tratado como rota, e o bundler emitiu warnings reais ("missing required default export") para cada um desses arquivos. Confirmado na documentação oficial (`docs.expo.dev`) e já previsto pelo `AGENTS.md` ("Keep non-route code ... outside `src/app/`"). Solução: os três arquivos de estilo das telas moraram para `src/styles/` (`login.styles.ts`, `produtos.styles.ts`, `novo-produto.styles.ts`), importados normalmente pelas telas via `@/styles/...`. Continuam 100% isolados em `StyleSheet.create`, só não ficam fisicamente "ao lado" do arquivo de rota.

## Checklist de Execução (ordem da spec, seção 9)

- [x] `src/types/index.ts`
- [x] `src/services/api.ts`
- [x] `src/components/CustomInput/styles.ts` + `index.tsx`
- [x] `src/components/CustomButton/styles.ts` + `index.tsx`
- [x] `src/components/ProductCard/styles.ts` + `index.tsx`
- [x] `src/contexts/AuthContext.tsx`
- [x] `src/app/_layout.tsx`
- [x] `src/app/(auth)/_layout.tsx`, `styles.ts`, `login.tsx`
- [x] `src/app/(app)/_layout.tsx`
- [x] `src/app/(app)/styles.ts`, `index.tsx`
- [x] `src/app/(app)/novo-produto.styles.ts`, `novo-produto.tsx`

## Limpeza do Template Padrão
Removido todo o cluster do template `create-expo-app` (tabs de exemplo) que ficaria órfão ou colidiria em rota com a estrutura da spec: `src/app/index.tsx`, `src/app/explore.tsx`, `src/components/app-tabs*`, `animated-icon*`, `themed-text.tsx`, `themed-view.tsx`, `hint-row.tsx`, `external-link.tsx`, `web-badge.tsx`, `ui/collapsible.tsx`, `constants/theme.ts`, `hooks/use-color-scheme*`, `hooks/use-theme.ts`, `src/global.css`. Confirmado por grep que nenhum arquivo fora desse cluster os referenciava. **Nota:** `src/constants/theme.ts` foi recriado depois (fase 5), com conteúdo totalmente diferente — tokens de design (`cores`, `espacamento`, `raios`), não o tema do template antigo.

## Estrutura Atual (real, em construção)

```text
src/
├── app/
│   ├── _layout.tsx              # Stack.Protected por token de auth, splash controlado por carregandoSessao
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── (app)/
│       ├── _layout.tsx
│       ├── index.tsx            # listagem + busca/autocomplete + filtro de status
│       ├── novo-produto.tsx
│       ├── editar-produto.tsx     # busca produto por id (query param) e reusa ProdutoForm
│       ├── visualizar-produto.tsx # detalhe + lotes + historico de alteracoes (log de-para)
│       └── adicionar-estoque.tsx  # form de entrada de lote + simulador de margem
├── components/
│   ├── CustomInput/
│   ├── CustomButton/
│   ├── ProductCard/
│   ├── ProdutoForm/              # form compartilhado entre criar/editar
│   ├── FiltroProdutos/           # busca com autocomplete + chips de status
│   ├── TabelaLotes/              # lista de lotes com selo de status (regular/vencendo/vencido)
│   ├── BarraTopo/                # "‹ Voltar" + acao opcional a direita (telas internas)
│   ├── MenuLateral/              # drawer pela direita: tema, usuario, navegacao, sair
│   ├── ModalCategoria/           # bottom sheet (Modal nativo) para criar categoria
│   ├── SeletorData/
│   └── Toast/
├── constants/
│   └── theme.ts                  # coresClaro/coresEscuro, espacamento, raios, fonteMono, sombra
├── contexts/
│   ├── AuthContext.tsx
│   ├── TemaContext.tsx            # modo claro/escuro persistido no AsyncStorage
│   └── ToastContext.tsx           # mostrarToast(mensagem)
├── hooks/
│   └── useCampoMoeda.ts          # mascara de centavos reutilizavel (preco do produto + custo do lote)
├── services/
│   ├── api.ts
│   ├── produtos.ts
│   └── categorias.ts
├── styles/
│   ├── login.styles.ts
│   ├── produtos.styles.ts
│   ├── produto-formulario.styles.ts   # compartilhado por novo-produto e editar-produto
│   ├── visualizar-produto.styles.ts
│   └── adicionar-estoque.styles.ts
├── types/
│   └── index.ts
└── utils/
    ├── moeda.ts                 # formatarMoeda, extrairDigitos, formatarCentavosComoTexto
    ├── data.ts                  # formatarData (pt-BR)
    ├── logProduto.ts            # compararProdutos (gera o log de-para)
    ├── lote.ts                  # status do lote, custo medio ponderado, margem, preco sugerido
    └── estoque.ts               # nivel de estoque (critico < 5, baixo < 20, normal)
```

## Passada de UX/UI (Fase 5)

Orientada por heurísticas conhecidas, não por gosto pessoal:

- **Prevenção de erro (Nielsen #5):** excluir produto (na listagem e na visualização) agora exige confirmação via `Alert.alert` com opção destrutiva — antes, um único toque apagava sem aviso.
- **Alvo de toque mínimo de 44px** (Apple HIG / Material Design): todos os botões e chips (`CustomButton`, ações do `ProductCard`, chips do `FiltroProdutos`, sugestões do autocomplete) têm `minHeight`/`height` de `ALVO_TOQUE_MINIMO` (44).
- **Contraste de texto (WCAG AA):** cinzas fracos demais (`#829AB1`, `#9AA5B1`) trocados por tons mais escuros com contraste ≥ 4.5:1 sobre fundo claro (`cores.textoTerciario` = `#64748B`, `cores.textoSecundario` = `#334155`).
- **Reconhecimento em vez de memorização (Nielsen #6) — ícones:** botões de Editar/Excluir/Visualizar (e os demais botões do app: Entrar, Sair, Novo produto, Salvar/Atualizar) ganharam ícones do `@expo/vector-icons` (`Ionicons`), além do texto. **Nota de versão:** a documentação oficial do Expo (`docs.expo.dev/guides/icons`) avisa que `@expo/vector-icons` está sendo descontinuado em favor de `@react-native-vector-icons`, mas o pacote novo não tinha nomes de pacote/instalação documentados publicamente no momento da implementação — optamos por `@expo/vector-icons` (ainda funcional e com exemplo de código atual na doc) e deixamos essa nota para revisão futura se o pacote for de fato removido.
- **Estado de foco visível:** `CustomInput` agora destaca a borda (cor primária, mais grossa) quando o campo está focado — ajuda a rastrear onde o teclado vai atuar, especialmente em formulários longos.
- **Teclado não cobre o formulário:** `KeyboardAvoidingView` adicionado nas telas de login, novo produto e editar produto.
- **Acessibilidade para leitor de tela:** `accessibilityRole`/`accessibilityLabel`/`accessibilityState` adicionados em todos os elementos tocáveis (botões, chips, sugestões, switch, imagem do logo, indicadores de carregamento).
- **Consistência (Nielsen #4) — tokens de design:** criado `src/constants/theme.ts` (`cores`, `espacamento`, `raios`, `ALVO_TOQUE_MINIMO`) como fonte única da paleta e das medidas, substituindo hex-codes espalhados pelos arquivos `styles.ts`.

## Redesign Visual (Fase 6)

**Motivo:** usuário testou a Fase 5 e achou "extremamente feio" — pediu explicitamente paleta/cards/espaçamento/tipografia/alinhamento revistos, direção "moderno/vibrante" (referências dadas: Notion, Linear, Revolut).

- **Paleta trocada:** de azul/cinza corporativo para roxo/violeta vibrante (`cores.primaria` = `#6C5CE7`) com gradiente (`primaria` → `primariaClara`) em vez de cor sólida nos botões principais.
- **`expo-linear-gradient` adicionado** (compatível com Expo Go e web, confirmado via docs antes de instalar) — usado no `CustomButton`, que agora tem `variante?: "primaria" | "perigo" | "neutro"` (cada uma com seu próprio gradiente em `cores.gradientes`) em vez de cor customizada via `estiloContainer`.
- **Sombras via `boxShadow`:** o RN atual avisa que `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` estão obsoletos a favor de um único `boxShadow` (sintaxe CSS, cross-platform incluindo Android/web) — confirmado via docs oficiais. `src/constants/theme.ts` exporta `sombra.cartao`/`sombra.botao`/`sombra.flutuante` já nesse formato.
- **Raios maiores:** escala `raios` subiu de 8/12 para 10/16/22 — visual mais arredondado/suave.
- **`ProductCard` redesenhado** de layout em duas colunas (texto | botões empilhados) para: cabeçalho (nome + preço) → linha de detalhes com ícones (quantidade, código de barras) → rodapé com selos + 3 botões de ação **circulares só com ícone** (antes eram chips com ícone+texto, ocupavam muito espaço vertical).
- **Bug real encontrado e corrigido nessa fase:** ao tornar o card inteiro clicável (tocar em qualquer lugar abre a visualização) envolvendo tudo — incluindo os botões de ação — num único `TouchableOpacity`, o React Native Web gera `<button>` HTML aninhado em `<button>`, que é HTML inválido; o browser reportava erro em tempo de execução ("`<button>` cannot contain a nested `<button>`"). Corrigido separando: só a área de conteúdo (nome/preço/detalhes) fica dentro do `TouchableOpacity` de "visualizar"; a barra de ações fica como `View` irmã, fora dele — sem aninhamento.
- **Inputs "preenchidos":** `CustomInput` passou de borda cinza simples para fundo levemente tingido (`cores.neutroFundo`) que vira branco + borda colorida no foco — mesmo padrão visual usado por Linear/Material 3.
- **Tela de login:** logo ganhou um cartão branco arredondado com sombra ao redor (em vez do ícone solto), título maior (32px, peso 800, letter-spacing negativo) para mais hierarquia.

## Gestão de Estoque por Lote (Fase 7)

**Decisão de escopo (importante):** o total em estoque continua sendo `produto.quantidade` — o mesmo campo já usado na listagem, nos filtros e no selo de "últimas unidades". Cada lote adicionado **soma** nesse total (`PUT /produtos/:id` com `quantidade` incrementada), em vez do total virar uma soma calculada dos lotes em tempo real. Isso evita quebrar produtos que não têm nenhum lote cadastrado (todos os produtos originais da spec) e mantém uma única fonte de verdade pro estoque. A tabela de lotes é um detalhe complementar (de onde veio o estoque e a que custo), não a fonte de verdade.

- **`Lote`** (`src/types/index.ts`): `id`, `produtoId`, `codigo`, `validade` (ISO ou `null` = não expira), `quantidadeEntrada`, `saldoRestante` (= `quantidadeEntrada` na criação; não há fluxo de venda/consumo nesta app para decrementar), `custoUnitario`, `criadoEm`. Nova coleção `lotes` no `db.json` (recurso REST automático do `json-server`, filtrável via `GET /lotes?produtoId=`).
- **`src/utils/lote.ts`:** `gerarCodigoLote()` (`LOTE-AAAAMMDD-XXXX`), `calcularStatusLote(validade)` (vencido / vencendo em até 30 dias / regular), `calcularCustoMedioPonderado(lotes)` (média ponderada pelo `saldoRestante`), `calcularMargem(precoVenda, custo)`, `sugerirPrecoVenda(custo, margemAlvo)`. `MARGEM_ALVO_PADRAO = 40` (%).
- **`src/hooks/useCampoMoeda.ts`:** a lógica de máscara de centavos (antes só dentro do `ProdutoForm`) virou hook reutilizável — usada tanto no campo Preço do produto quanto no campo Custo Unitário do lote. Mesma correção de cursor da Fase 3 (força seleção no fim do texto via estado controlado) se aplica aqui também.
- **`src/components/TabelaLotes/`:** lista os lotes de um produto com selo de status colorido (verde/amarelo/vermelho) e grade com validade, quantidade de entrada, saldo restante e custo unitário.
- **`src/app/(app)/adicionar-estoque.tsx`** (nova rota, `id` via query param, mesmo padrão de `editar-produto.tsx`): código do lote (com botão "Gerar" automático), switch "Não expira" (esconde o campo de validade), validade em texto livre `AAAA-MM-DD` (sem date-picker nativo — decisão consciente para não adicionar uma dependência nova/nativa só para isso; pode ser revisitado com `@react-native-community/datetimepicker` se o usuário quiser um seletor de fato), quantidade recebida, custo unitário mascarado. Simulador de margem em tempo real: mostra preço de venda atual, margem do lote, margem alvo, e — só quando a margem fica abaixo do alvo — uma caixa de sugestão com o novo preço calculado e um switch "Atualizar preço de venda do catálogo".
- **Fluxo de salvamento:** `POST /lotes` → `PUT /produtos/:id` (soma a quantidade recebida; atualiza `preco` só se o switch de atualizar catálogo estiver ligado) → reaproveita `compararProdutos` + `POST /logs` já existentes da Fase 4, então a entrada de estoque (e a eventual mudança de preço) aparece automaticamente no histórico de alterações do produto, sem código de log duplicado.
- **`visualizar-produto.tsx`:** ganhou a métrica "Custo médio ponderado" (dentro da aba Produto).
- **Validado ponta a ponta com Playwright:** fluxo completo de adicionar lote sem validade (com "Não expira"), cálculo de custo médio, e o caminho de margem abaixo do alvo com atualização de preço via checkbox — confirmado que o produto, o lote e o log ficam consistentes entre si após o `POST`/`PUT`.

## Ajustes de UX Pós-Fase 7 (feedback direto do usuário)
- **Ordem dos 3 botões de ação invertida:** o usuário testou no celular e relatou que "Excluir" ficava perto demais do polegar. Ordem final: Excluir (esquerda, mais difícil de alcançar sem querer) → Editar (meio) → Estoque (direita, ação mais usada, mais fácil de alcançar).
- **Abas Produto / Lotes / Log:** a tela de visualização, que antes empilhava cartão de dados + tabela de lotes + histórico tudo em sequência no scroll, virou um segmented control com 3 abas (estado local `abaAtiva`, sem lib nova). Cabeçalho (nome + selos) e os 3 botões de ação continuam sempre visíveis acima das abas, já que são ações globais do produto, não de uma aba específica.
- **Correção de layout (2ª rodada):** o usuário pediu explicitamente o oposto do que eu tinha entendido — abas fixas no **topo** (não embaixo) e os 3 botões de ação fixos no **rodapé** (não dentro do scroll). Layout final: `abas` (View fixa, fora do `ScrollView`) → `ScrollView` (cabeçalho + conteúdo da aba ativa) → `acoes` (View fixa, fora do `ScrollView`, com fundo/borda de barra de rodapé).

## Seletor de Data e Regras de Validade (pedido do usuário)

- **`@react-native-community/datetimepicker` e `@expo/ui` foram avaliados e descartados** para o campo "Validade": o primeiro não tem build web (só `src/index.js`, sem `.web.js`, quebraria no navegador, que é como o usuário testa o app); o segundo tem um `DateTimePicker.web.tsx` que é um stub — `return null`, não renderiza nada no navegador. Confirmado lendo o código-fonte instalado em `node_modules`, não só a documentação. Os dois pacotes foram instalados, verificados e **removidos** (`npm uninstall` + reversão do plugin em `app.json`) antes de decidir pela alternativa abaixo.
- **`src/components/SeletorData/`** (novo): calendário próprio, 100% React Native puro (View/Text/TouchableOpacity), sem nenhuma dependência nativa — funciona igual em web, iOS e Android. Campo mostra a data no formato `DD/MM/AAAA` (`formatarDataCurta`, nova função em `src/utils/data.ts`, usa `Intl.DateTimeFormat("pt-BR", { dateStyle: "short" })`); ao tocar, abre um painel com navegação de mês e grade de dias. Armazena/retorna a data como ISO (`AAAA-MM-DD`) internamente, igual ao resto do app.
- **`TabelaLotes` corrigida** para usar `formatarDataCurta` (só data) em vez de `formatarData` (data+hora) na validade do lote — a validade é um campo de data, não de data+hora.
- **Regras de validade em `adicionar-estoque.tsx`:** `src/utils/lote.ts` ganhou `calcularDiasParaVencer(validade)` (extraído de `calcularStatusLote` para reuso, com normalização de horário pra evitar erro de 1 dia por fuso). Ao escolher uma validade (quando "Não expira" está desligado), um aviso inline aparece abaixo do calendário:
  - **Data no passado (`vencido`):** aviso vermelho — "Essa data já passou (há N dias). O produto já estaria vencido — confira se a validade foi informada corretamente." Não bloqueia o envio (pode ser um lote vencido de verdade, registrado de propósito).
  - **Faltam até 30 dias (`vencendo`):** aviso âmbar — "Esse lote vence em N dias — fica próximo do vencimento."
  - **Mais de 30 dias:** nenhum aviso.

## Menu Lateral (Drawer)

- **`src/components/MenuLateral/`** (novo): drawer próprio (sem `expo-router/drawer` nem `@react-navigation/drawer` — não instalados, para não trocar a arquitetura de navegação já existente por causa de um único item de menu). `Animated.Value` + `translateX`/`opacity` pra abrir/fechar, `Pressable` de overlay escuro por trás pra fechar tocando fora. Mostra nome mocado ("Ricardo", fixo — não vem do login, que só coleta e-mail/senha) e um item "Produtos" (ativo, já que é a única tela por enquanto). Substitui o antigo botão "Sair" solto no cabeçalho; "Sair" agora vive dentro do menu.
- **Bug de lint corrigido:** `useRef(new Animated.Value(...)).current` acionava a regra nova do React Compiler `react-hooks/refs` ("Cannot access refs during render"). Troquei por `useState(() => new Animated.Value(...))` — inicialização preguiçosa sem acessar `.current` no corpo do componente.

## Bug Corrigido: listagem "muito curta" no celular

**Sintoma:** o usuário reportou que a lista de produtos aparecia cortada/curta no celular, mesmo funcionando nos meus screenshots. **Causa raiz:** o `FlatList` só tinha `contentContainerStyle`, sem `style={{ flex: 1 }}` no componente em si — em React Native, é o `style` do próprio `FlatList`/`ScrollView` que faz o componente ocupar o espaço disponível no layout flex; sem isso, ele encolhe pro tamanho do conteúdo, e como não há um `ScrollView` externo envolvendo a tela, o excesso simplesmente fica sem uma região rolável de verdade. **Por que passou pelos meus testes:** meus screenshots usavam `fullPage: true`, que no Playwright captura toda a extensão rolável da página — isso mascarou o bug porque capturava o conteúdo inteiro independentemente de estar corretamente contido num flex. Corrigido adicionando `styles.listaContainer` (`{ flex: 1 }`) ao `style` do `FlatList`. Validado depois com screenshot **sem** `fullPage`, do tamanho real de um iPhone (390×844), confirmando que a lista agora ocupa a tela e rola dentro da própria área.

## Paginação Real com Scroll Infinito

A listagem de produtos parou de carregar tudo de uma vez (client-side) e passou a paginar de verdade no servidor:

- **`src/services/produtos.ts`** (novo): `buscarProdutosPaginado({ pagina, busca, filtroStatus })` monta os query params do `json-server` (`_page`, `_limit=10`, `nome_like` pra busca, `ativo`/`quantidade` pros filtros de status) e lê `X-Total-Count` do cabeçalho da resposta pra montar o envelope de paginação. Confirmado via `curl` direto no `json-server` antes de codar: `_page`/`_limit`, `nome_like`, `ativo` e `quantidade` funcionam exatamente como esperado nessa versão (0.17.4).
- **`RespostaPaginada<T>`** (`src/types/index.ts`): `{ itens, paginaAtual, itensPorPagina, totalItens, quantidadeNaPagina, filtro, ehPrimeiraPagina, ehUltimaPagina }` — cobre exatamente os campos pedidos (total de itens, página atual, itens por página, filtro aplicado, quantidade na página, primeira/última página).
- **`(app)/index.tsx`:** busca com **debounce de 350ms** antes de disparar a query real (evita bater no servidor a cada tecla); autocomplete do `FiltroProdutos` também virou uma busca real no servidor (debounce de 250ms, `buscarSugestoesProdutos`, limitada a 5 resultados), em vez de filtrar um array local — `FiltroProdutosProps` mudou de `produtos: Produto[]` pra `sugestoes: Produto[]`, já vindas prontas do componente pai. `FlatList` ganhou `onEndReached`/`onEndReachedThreshold={0.4}` pra carregar a próxima página e **acrescentar** (não substituir) aos itens já carregados; `ListFooterComponent` mostra um spinner pequeno enquanto carrega mais. Trocar busca ou filtro de status volta pra página 1 e substitui a lista (não acrescenta). Excluir um produto decrementa `totalItens` localmente, sem precisar recarregar tudo.
- **Contador visível:** "Mostrando N de M produtos" abaixo da lista.
- **Validado com Playwright:** semeei 12 produtos extras via `curl` (total 17, acima do limite de 10 por página), confirmei que a página 1 carrega 10, o scroll até o fim dispara exatamente uma requisição da página 2 (sem duplicar), os itens se acumulam (17 de 17) e novas rolagens não disparam mais requisições (`ehUltimaPagina`). Também confirmei que digitar na busca dispara `nome_like` tanto na chamada de sugestões quanto na lista paginada, e filtra corretamente. Produtos de teste removidos do `db.json` depois (mantendo os que o próprio usuário criou).
- **Filtro de status virou select:** os 4 chips (Todos/Ativos/Sem estoque/Inativos) ocupavam espaço demais ao lado da busca. Viraram um select compacto (campo + painel de opções, mesmo padrão visual do `SeletorData`) de largura fixa (142px), lado a lado com o campo de busca (`flex: 1`) na mesma linha — sem nova dependência, só reaproveitando o padrão "campo + painel" já estabelecido.

## Backend Mock (Desenvolvimento Local)
`json-server@0.17.4` (versão estável, não a v1 beta) lê `db.json` na raiz e expõe REST em `http://localhost:3000`, batendo com o fallback padrão de `src/services/api.ts`. Rodar com `npm run mock-api`. Seed inicial: 3 produtos em `db.json` (`produtos`).

## Arquivos Criados pela Spec
- `src/types/index.ts` — `Produto`, `Usuario`, `AuthContextData`, `CustomInputProps`, `CustomButtonProps`, `ProductCardProps`.
- `src/services/api.ts` — instância Axios com `baseURL` via `EXPO_PUBLIC_API_URL` e timeout de 10s.
- `src/components/CustomInput/` — input controlado com label e erro visual, sem estilos inline.
- `src/components/CustomButton/` — `TouchableOpacity` com estados de loading (`ActivityIndicator`) e desabilitado; não usa `Button` nativo.
- `src/components/ProductCard/` — cartão com nome, quantidade, preço formatado (`Intl.NumberFormat` pt-BR/BRL), selo ativo/inativo e ação de remoção.
- `src/contexts/AuthContext.tsx` — `AuthProvider`/`useAuth`; restaura sessão do `AsyncStorage` na montagem (`carregandoSessao` evita flash de rota errada), `login` valida campos e gera usuário/token local (ver decisão de autenticação acima), `logout` limpa as chaves.
- `src/app/_layout.tsx` — raiz com `AuthProvider` + `Stack` usando `Stack.Protected` (padrão atual do Expo Router v57 para rotas protegidas) alternando entre os grupos `(app)` e `(auth)` conforme `token`; splash nativa escondida só após `carregandoSessao` finalizar.
- `src/app/(auth)/` — `login.tsx` com logo (`assets/images/icon.png`), `CustomInput` de e-mail/senha e `CustomButton` que chama `login()` do `AuthContext`; erros de login exibidos via `Alert.alert`.
- `src/components/CustomButton` — ganhou prop opcional `estiloContainer` (`StyleProp<ViewStyle>`) para permitir variações de tamanho/cor por tela (ex.: botão "Sair" compacto) sem estilos inline.
- `src/app/(app)/_layout.tsx` — apenas declara o `Stack` do grupo; a checagem de autenticação já é feita pelo `Stack.Protected` na raiz, então não há verificação duplicada aqui.
- `src/app/(app)/index.tsx` — busca `GET /produtos` em efeito de montagem, `FlatList` com `keyExtractor` por `id`, `ListEmptyComponent`, `ActivityIndicator` durante o carregamento, exclusão via `DELETE /produtos/:id` com atualização otimista da lista, botão "Sair" (`logout`) e botão para `novo-produto`.
- `src/app/(app)/novo-produto.tsx` — 3 campos controlados (nome/quantidade/preço) com validação reativa em `useEffect` por campo (regra: nome ≥ 3 chars, quantidade ≥ 0, preço > 0) e `Switch` de "Ativo para venda"; botão de salvar desabilitado até formulário válido; `POST /produtos` com feedback via `Alert.alert` e retorno à listagem em caso de sucesso. **Nota:** os `useEffect` de validação por campo violam a regra de lint `react-hooks/set-state-in-effect`; mantidos por decisão explícita do usuário porque o requisito 6 do edital exige literalmente um "efeito de monitoramento" via `useEffect`. Cada `setState` correspondente tem um `// eslint-disable-next-line` pontual — única exceção à regra de "nenhum comentário" do `ARCHITECTURE.md`, por ser diretiva de ferramenta, não explicação de código.

## Funcionalidades Adicionais (pedidas pelo usuário, além da spec original)

- **Tipo `Produto` estendido:** `codigoBarras: string` (obrigatório, 8–13 dígitos) e `descricao?: string` (opcional). `DadosProduto = Omit<Produto, "id">` criado para os payloads de criar/editar.
- **`src/utils/moeda.ts`:** `formatarMoeda` (exibição com símbolo, usado no `ProductCard`), `extrairDigitos`, `formatarCentavosComoTexto` (máscara de centavos, sem símbolo, usada no formulário).
- **`src/components/ProdutoForm/`:** componente de formulário compartilhado entre criar e editar (nome, código de barras, quantidade, preço mascarado, descrição opcional, switch ativo). Evita duplicar ~100 linhas de validação entre as duas telas.
- **Máscara de preço em centavos:** digitar `1`,`9`,`9`,`0`,`0` produz `0,01` → `0,19` → `1,99` → `19,90` → `199,00`, com os últimos dígitos sempre representando os centavos. **Bug real encontrado e corrigido:** o campo é controlado (`value` = texto formatado), e sem forçar a posição do cursor no fim do campo a cada mudança, o texto digitado podia ser inserido no início ou no meio do valor (dependendo de como o foco chegou ao campo — clique vs. foco programático), inflando ou corrompendo o valor. Corrigido controlando `selection` como estado próprio (`selecaoPreco`), reforçado em `onFocus` e `onSelectionChange`, sempre apontando para o fim do texto. Validado com Playwright (digitação tecla-a-tecla, com e sem clique prévio no campo).
- **`src/app/(app)/editar-produto.tsx`:** lê `id` via `useLocalSearchParams` (query param, sem rota dinâmica `[id].tsx`), busca `GET /produtos/:id` no efeito de montagem, reusa `ProdutoForm` com `valoresIniciais`, envia `PUT /produtos/:id` no submit.
- **`ProductCard`:** agora mostra código de barras, descrição (se houver), selo extra "Últimas unidades" quando `0 < quantidade < 5`, e um botão "Editar" (além de "Remover") que aciona `onEditar(id)`.
- **`src/components/FiltroProdutos/`:** campo de busca por nome com autocomplete (sugestões em dropdown, até 5 resultados, aparecem/somem com foco/blur/seleção) + chips de filtro por status (Todos/Ativos/Sem estoque/Inativos). A tela `(app)/index.tsx` combina busca + filtro via `useMemo` sobre a lista completa de produtos (filtragem no cliente, não uma nova chamada à API).
- **`criadoEm`/`atualizadoEm`:** ISO strings geradas no cliente (`new Date().toISOString()`), já que o `json-server` não gera timestamps sozinho. `novo-produto.tsx` seta os dois iguais na criação; `editar-produto.tsx` preserva `criadoEm` do produto original e só atualiza `atualizadoEm`.
- **Log de alterações (de/para):** nova coleção `logs` no `db.json` (recurso REST automático do `json-server`, filtrável via `GET /logs?produtoId=`). `src/utils/logProduto.ts` (`compararProdutos`) compara o produto antes/depois campo a campo (nome, código de barras, quantidade, preço, descrição, ativo) e monta a lista de alterações; `editar-produto.tsx` grava um log via `POST /logs` só quando algo de fato mudou.
- **`src/app/(app)/visualizar-produto.tsx`:** tela de detalhe (nova rota, `id` via query param) — mostra todos os campos do produto, selos (ativo/inativo, últimas unidades), datas formatadas em pt-BR, botões Editar/Excluir, e o histórico de alterações (mais recente primeiro). Usa `useFocusEffect` para recarregar produto + logs sempre que a tela reganha foco (ex.: voltando da edição).
- **`ProductCard`:** nome agora é clicável (abre a visualização). **Atualizado depois** — ver seção "Card Compacto" abaixo: os botões viraram um menu de 3 pontinhos.

## Card Compacto + Menu de 3 Pontinhos (pedido do usuário)

O usuário achou os cards grandes demais ("mostrar mais produtos na tela") e pediu que Editar/Excluir só aparecessem ao tocar nos "3 pontinhos".

- **`ProductCard` reduzido de 3 linhas + rodapé com 3 botões circulares pra 2 linhas:** nome+preço em cima, quantidade+código+selos embaixo (só mostra selo "Inativo" quando de fato inativo — "Ativo" deixou de ser exibido, já que é o padrão esperado; menos badge = menos altura). Card caiu de ~140-160px pra ~70px de altura; cabem quase o dobro de itens na tela.
- **Menu de contexto (`⋮`):** Visualizar/Editar/Remover viraram um painel flutuante que abre ao tocar no ícone `ellipsis-vertical`, mesmo padrão visual dos outros menus/seletores do app (`SeletorData`, select de status). `menuAberto`/`aoAlternarMenu` são controlados pela tela pai (`(app)/index.tsx` guarda qual produto tem o menu aberto por `id`), não pelo próprio `ProductCard` — garante que só um menu fica aberto por vez na lista inteira.
- **Bug real de z-index encontrado e corrigido:** o painel do menu abria **atrás** do próximo card da lista, cobrindo as opções "Editar"/"Remover". Colocar `zIndex` no card em si não resolve porque o `FlatList` (via `VirtualizedList`) envolve cada linha num wrapper próprio pra virtualização/performance — é esse wrapper, não o `card`, que precisa do `zIndex` elevado pra vencer a ordem do DOM entre linhas irmãs. Corrigido com a prop `CellRendererComponent` do `FlatList` (mecanismo oficial documentado exatamente pra esse cenário — "elevar uma linha específica acima das vizinhas"), aplicando `zIndex`/`elevation` alto só na célula cujo produto tem o menu aberto no momento. Tipo `CellRendererProps<Produto>` importado de `@react-native/virtualized-lists` (dependência transitiva do `react-native`, não precisou instalar nada novo — confirmado lendo o `.d.ts` instalado, já que o pacote não está listado no `package.json` do projeto diretamente).

## Redesign pelo Protótipo (Fase 9)

O usuário entregou um protótipo HTML/Tailwind (catálogo, detalhe com abas, adicionar estoque, novo produto, modal de categoria, drawer com tema, toast) como referência visual. Uma sessão anterior começou a migração (contextos de tema/toast, categorias) mas parou no meio, com `tsc` quebrado; esta fase terminou tudo.

- **Tema claro/escuro:** `src/constants/theme.ts` exporta `coresClaro`/`coresEscuro` (mesmas chaves, tipo `Cores`) em paleta Tailwind indigo/slate. `TemaContext` escolhe pelo `useColorScheme` e persiste a escolha manual em `@stockflow:tema`. **Padrão de estilos mudou:** todo `styles.ts` agora exporta `criarEstilos(cores: Cores)` (continua `StyleSheet.create`, só parametrizado pela paleta) e o componente faz `useMemo(() => criarEstilos(cores), [cores])`. Nenhum hex fora de `theme.ts`.
- **`CustomButton` sem gradiente:** variantes `primaria` (indigo sólido + sombra), `perigo` (fundo rosado suave, texto vermelho) e `neutro` (cinza suave), como no protótipo; prop `compacto` para a barra de ações. `expo-linear-gradient` ficou sem uso no código (dependência mantida no `package.json`).
- **`CustomInput`:** props `obrigatorio` (asterisco vermelho), `contador` ("15/80" à direita do rótulo) e `monoespacado` (EAN, preço, lote). Anel de foco via `boxShadow`. **Bug de web corrigido:** Chrome desenhava o anel de foco nativo por cima da borda customizada porque RN Web gera `outline-style: auto`, que ignora `outline-width: 0`; resolvido com `outlineStyle: "solid"` + `outlineWidth: 0`.
- **Listagem:** header com logo + "Produtos / Inventário & Operações" e pílula de usuário que abre o drawer; busca com lupa e botão limpar; filtros de status voltaram a ser **chips**, agora em linha própria com rolagem horizontal (o motivo da troca por select na Fase 8 era falta de espaço ao lado da busca, que deixou de existir). O chip ativo mostra o total (`Todos (305)`). `ProductCard` com ícone da categoria, selo de estoque colorido por nível (`utils/estoque.ts`) e preço em mono à direita; menu ⋮ mantido.
- **Drawer (`MenuLateral`) pela direita:** alternância de tema, iniciais do usuário + cargo + e-mail (do `AuthContext`), itens Produtos (total), Categorias (total, abre o `ModalCategoria`) e Vendas ("Em breve", só toast), botão "Sair da conta" no rodapé.
- **Detalhe:** `BarraTopo` com selo Ativo/Inativo, nome + categoria + EAN e abas segmentadas fixas no topo (Produto / Lotes (n) / Histórico); aba Produto com 2 cards de métrica (preço + margem média sobre o custo médio ponderado; saldo + aviso por nível) e tabela de informações; aba Histórico virou uma timeline (valor antigo riscado → novo em destaque). Ações fixas no rodapé mantidas (Excluir / Editar / Estoque).
- **Formulários (novo/editar produto, adicionar estoque):** campos agrupados em cartões por seção; "Gerar" para código de barras (`789` + 10 dígitos); "Limpar" no topo do novo produto (remonta o `ProdutoForm` via `key`).
- **Categorias:** coleção `categorias` adicionada ao `db.json` com 5 seeds (Periféricos, Conectividade, Cabos, Acessórios, Outros). Sem ela o `json-server` devolvia 404 no `POST /categorias`.
- **`ModalCategoria` agora usa `Modal` nativo:** antes era `position: absolute` renderizado dentro do `ScrollView` do formulário, então aparecia no fim do conteúdo em vez de cobrir a tela.
- **Feedback:** sucesso de criar/editar/estoque continua com `Alert.alert` (item 207 da spec) **e** também mostra toast, porque no navegador (onde o usuário testa) `Alert.alert` não faz nada.
- **Validado com Playwright** (390×844, sem `fullPage`): login, lista, menu ⋮, drawer, troca para escuro, detalhe/abas, adicionar estoque com simulador, novo produto → criar categoria no modal → salvar → toast → busca encontra o item com o ícone da categoria. Nenhum `pageerror`/erro de console. Dados de teste removidos depois.

### Ajustes pós-Fase 9 (feedback do usuário)
- **Bug real: a página inteira arrastava no celular (botão "Novo produto" subia e aparecia um branco embaixo).** Causa: ao mudar o `MenuLateral` para abrir pela **direita**, o painel fechado ficava em `translateX(+310)`, fora da tela, e isso alargava o documento (medido com Playwright emulando Pixel 7: `scrollWidth` 722 = 412 + 310). O navegador do celular então reduzia o zoom para caber tudo e deixava arrastar a página toda. Pela esquerda não acontecia porque não dá para rolar para coordenadas negativas. Correção: overlay + painel envolvidos num container `recorte` (absoluto, tela cheia, `overflow: "hidden"`, `pointerEvents="box-none"`). Depois disso a página mede exatamente o viewport (412×839) na lista e no detalhe. **Lição:** screenshots em viewport de desktop não pegam isso; testar com `devices['Pixel 7']` e checar `scrollWidth`/`scrollHeight` do documento.
- **Fundo do tema na raiz (feito antes de achar a causa acima, mantido por ser correto):** o overscroll revelava o fundo por trás do app, que nunca recebia a cor do tema (branco padrão do `body` no web / view raiz no nativo). `TemaContext` agora chama `SystemUI.setBackgroundColorAsync(cores.fundo)` (`expo-system-ui`, já instalado; no web ele pinta o `body`) a cada troca de tema, e no web também pinta o `<html>` e aplica `overscroll-behavior: none` (evita o pull-to-refresh do navegador). Os três `Stack` (`_layout` raiz, `(app)`, `(auth)`) recebem `contentStyle` com o fundo do tema (`src/styles/layout.styles.ts`).
- **Preço de custo no cadastro:** `Produto.precoCusto?: number` (opcional no tipo porque produtos antigos não têm). No `ProdutoForm` é **obrigatório** (> 0), lado a lado com o preço de venda, com caixa de "Margem estimada" ao vivo (verde ≥ alvo de 40%, âmbar abaixo, vermelho se venda < custo). Ao **criar** com quantidade > 0, `novo-produto.tsx` registra também um lote inicial (`POST /lotes`, validade `null`, custo = `precoCusto`), para o custo médio ponderado e a aba Lotes já nascerem consistentes. `precoCusto` entra no log de-para e é preservado em `adicionar-estoque.tsx`. No detalhe, a margem média usa o custo médio dos lotes e cai para `precoCusto` quando não há lotes.
- **Filtros "Disponíveis p/ venda" e "Perto do vencimento"** (chips novos no `FiltroProdutos`, `StatusFiltro` ganhou `"disponiveis"` e `"vencendo"`), ambos paginados no servidor como os demais e combináveis com a busca:
  - **Disponíveis:** `ativo=true&quantidade_gte=1`.
  - **Perto do vencimento:** a validade mora nos lotes, não no produto. Então `buscarProdutosPaginado` primeiro busca `GET /lotes?validade_gte=<hoje>&validade_lte=<hoje+30>&saldoRestante_gte=1` (mesma janela de 30 dias do selo "vencendo", `DIAS_LIMITE_VENCENDO` agora exportado de `utils/lote.ts`, e `calcularJanelaVencendo()` monta as datas ISO), junta os `produtoId` sem repetir e pagina `GET /produtos?id=a&id=b...`. Os params viraram `URLSearchParams` porque o axios serializa arrays como `id[]=`, que o `json-server` não entende. Sem nenhum lote na janela, devolve a resposta vazia sem chamar `/produtos`. Lotes já vencidos e lotes sem saldo **não** entram. Confirmado via `curl` que o `json-server` 0.17 compara `validade_gte/_lte` como texto, o que funciona para ISO `AAAA-MM-DD`.
  - Validado com Playwright (Pixel 7) usando dois lotes temporários (um vencendo em 10 dias, outro vencido): só o primeiro produto aparece, e a busca por nome restringe dentro do filtro. Lotes temporários removidos depois.
- **Aviso de vencimento por lote (listagem + visualização):**
  - `utils/lote.ts`: `resumirVencimentos(lotes)` considera só lotes com validade e saldo > 0 e separa `lotesVencendo` (0–30 dias) de `lotesVencidos`, cada um com `diasParaVencer`, ordenados do mais urgente. Também soma as unidades de cada grupo e guarda o menor prazo. `agruparVencimentosPorProduto` gera o mapa `produtoId → ResumoVencimento`, e `descreverPrazo(dias)` gera "vence em N dias" / "vence hoje" / "venceu há N dias". Tipos `LoteComPrazo`/`ResumoVencimento` em `types/index.ts`.
  - **Listagem:** no `useFocusEffect`, **uma** chamada `buscarLotesComValidadeProxima()` (`GET /lotes?validade_lte=<hoje+30>&saldoRestante_gte=1`, que já exclui validade `null`, conferido via curl) monta o mapa. `ProductCard` recebe `vencimento` e mostra o selo "Vence em Nd" (âmbar) ou "Lote vencido" (vermelho, com prioridade).
  - **Visualização (aba Produto):** cartão "Validade dos lotes" (âmbar se há lote vencendo, vermelho se há vencido) com as unidades perto do vencimento e quantos lotes são, as unidades já vencidas (se houver) e a lista de cada lote com **código**, data, prazo e saldo. Sem problemas: "Nenhum lote vence nos próximos 30 dias" ou "Nenhum lote com data de validade".
  - **Aba Lotes:** o selo de cada lote passou de "Vencendo em breve"/"Vencido" genéricos para o prazo real ("Vence em 10 dias", "Venceu há 13 dias"). Lotes sem validade mostram "Não expira".
  - Validado com Playwright (Pixel 7) com 4 lotes temporários (10 d, 25 d, 60 d, vencido): selos certos na lista, 12 un. em 2 lotes no detalhe (o de 60 dias ficou de fora), vencido em vermelho. Lotes removidos depois.
- **Código auxiliar (pedido da equipe; normalmente o código do catálogo):** `Produto.codigoAuxiliar?: string`, **opcional**. No `ProdutoForm`, fica na seção Identificação logo abaixo do EAN (até 30 caracteres, com contador, teclado em maiúsculas, fonte mono; vazio é salvo como `undefined`). Aparece no cabeçalho da visualização (`EAN · código auxiliar`) e numa linha própria da tabela de informações, e entra no log de-para.
  - **Bug latente corrigido junto:** `adicionar-estoque.tsx` montava o `DadosProduto` campo a campo antes do `PUT`, então qualquer campo novo seria **apagado** ao dar entrada de estoque (o `PUT` do json-server substitui o registro inteiro). Agora é `{ ...produto, quantidade, preco }`.
  - Validado com Playwright: criar com `CAT-00123` → editar para `CAT-00999` (aparece no histórico) → entrada de 4 un. → o `codigoAuxiliar` e o `precoCusto` continuam salvos. Produto, lote e logs de teste removidos depois.

## Módulo de Vendas / PDV (Fase 10, a partir do protótipo HTML do usuário)

Nova rota `src/app/(app)/vendas.tsx`, acessada pelo menu lateral ("Vendas & Caixa"). O item deixou de ser "Em breve", e o `MenuLateral` agora recebe `telaAtiva: "produtos" | "vendas"` e navega com `router`; os contadores e o item Categorias viraram opcionais. Uma tela só, com 3 abas internas (estado local `abaAtiva`), como no protótipo:

- **Catálogo:** busca por **nome, EAN ou código auxiliar** (sem acento/caixa), segmentado Em estoque / Sem estoque (padrão: em estoque) e chips de categoria. Lista só produtos **ativos** (`GET /produtos?ativo=true`, carregados inteiros e filtrados no cliente, porque o json-server 0.17 não faz OR entre campos). `CardProdutoVenda` com `SeletorQuantidade` (− n +) limitado ao estoque. Barra flutuante do carrinho quando há itens. Tocar no card abre a `ModalFichaProduto`, a "visão do cliente": preço, estoque e especificações, **sem custo, margem ou lotes**.
- **Carrinho:** comprador (`ModalCliente`: "consumidor não identificado" ou nome + CPF opcional com máscara e validação dos dígitos verificadores, em `utils/venda.ts`), itens com seletor e remover, desconto geral em % ou R$ **limitado a 50%** (`DESCONTO_MAXIMO_PERCENTUAL`; acima disso aparece aviso vermelho e o valor é travado no teto), forma de pagamento (PIX / crédito / débito / dinheiro) e totais.
- **Caixa:** fila Aguardando / Finalizados com `CardPedido`. A `ModalPedidoCaixa` faz a conferência de embalagem (checkbox por item, gravado via `PATCH`), mostra **de quais lotes saiu cada item**, adiciona itens de balcão (embalagem R$ 5, garantia R$ 25; `ITENS_BALCAO`) e confirma o recebimento (`status: "PAGO"`, `pagoEm`).
- **Modais em folha inferior:** `FolhaInferior` (Modal nativo + cabeçalho + scroll + rodapé), base dos 3 modais novos.
- **`CustomButton`** ganhou a variante `sucesso` (verde, usada em "Confirmar recebimento"). **`useCampoMoeda`** ganhou `redefinir(valor)`.

**Regras de estoque (decisão tomada, a confirmar com o usuário):**
- A baixa acontece **ao enviar o pedido ao caixa**, como no protótipo, e não no pagamento.
- `services/vendas.ts > criarPedido` relê cada produto e seus lotes, recusa se o estoque atual for menor que o pedido ("Estoque insuficiente…", via `Alert`) e planeja a baixa por **FEFO** (`planejarBaixaFefo` em `utils/lote.ts`: validade mais próxima primeiro, lotes sem validade por último, empate por `criadoEm`).
- Em seguida grava o pedido e, **em sequência**, `PATCH` na quantidade do produto, `PATCH` no `saldoRestante` de cada lote e um log "Quantidade (venda PED-000N)" no histórico do produto.
- Produtos sem lotes (legados) só têm a quantidade baixada.
- Não há transação no json-server: se a conexão cair no meio, a venda pode ficar parcial.

**Bug real de infraestrutura encontrado:** com `json-server --watch`, várias gravações seguidas (e em paralelo) faziam o servidor ler o `db.json` no meio de uma escrita, achar que era mudança externa e **reiniciar**. As próximas requisições tomavam `ERR_CONNECTION_REFUSED` (capturado com Playwright), e a primeira venda ficou parcial: pedido e lotes gravados, produto não. Correções: gravações da venda em sequência, e **`--watch` removido do `npm run mock-api`**. O json-server continua persistindo no `db.json` sem ele; o `--watch` só recarregava edições externas. Consequência: edições manuais no `db.json` com o mock rodando exigem reiniciá-lo.

Número do pedido: `PED-` + (total de pedidos + 1) com 4 dígitos. Coleção `pedidos` adicionada ao `db.json`. Tipos novos em `types/index.ts`: `Pedido`, `ItemPedido`, `BaixaLote`, `ItemBalcao`, `Cliente`, `ItemCarrinho`, `NovoPedido`, `FormaPagamento`, `StatusPedido`, `TipoDesconto` e props dos componentes. Constantes do usuário mocado em `src/constants/usuario.ts`.

**Validado com Playwright (Pixel 7):** produto temporário com 10 un. em 2 lotes (4 un. vencendo em 05/10, 6 un. em 01/12). Fluxo: busca por `aux-77` → +5 → ficha do cliente (sem custo) → comprador com CPF (inválido bloqueia, válido libera) → desconto 60% (avisa e trava em 50%) → 10% + dinheiro → enviar → caixa → embalar → + embalagem → confirmar. Resultado no banco: produto 10→5, lotes 4→0 e 6→5, pedido PAGO com subtotal 505, desconto 50, total 455, log no histórico. Sem erros no console, página 412×839 sem overflow. Dados de teste removidos.

**Fora desta versão:** leitor de código de barras por câmera (exigiria `expo-camera`, dependência nativa nova), cancelamento de pedido/estorno de estoque e fechamento de caixa.

## Caixa Separado, Cancelamento, Estoque Negativo e Clientes (Fase 11)

- **Caixa virou tela própria** (`src/app/(app)/caixa.tsx`, item "Caixa" no menu lateral com o número de pedidos aguardando), porque quem opera o caixa é outra pessoa. A tela de vendas ficou só com Catálogo e Carrinho; depois de enviar o pedido, o vendedor volta ao catálogo. O caixa tem métricas (na fila, recebido hoje), busca por nº do pedido, cliente ou início do CPF, e as filas Aguardando / Pagos / Cancelados. Atualiza sozinho a cada 15 s (`setInterval` dentro do `useFocusEffect`) e também ao puxar a lista (`RefreshControl`).
- **Cancelar pedido** (só pedidos aguardando): motivo obrigatório, escolhido entre `MOTIVOS_CANCELAMENTO` ou "Outro motivo" com texto livre. `cancelarPedido` marca `CANCELADO` e grava `motivoCancelamento`, depois **devolve o estoque** ao produto e aos mesmos lotes registrados em `itens[].lotes`.
- **Reabrir pedido cancelado:** `reabrirPedido` baixa o estoque de novo, com **FEFO recalculado no momento** (os lotes podem ter mudado nesse meio-tempo), atualiza `itens[].lotes`, zera o `embalado` e volta para `AGUARDANDO`.
- **Histórico do pedido:** `Pedido.eventos[]` (`criado` / `pago` / `cancelado` / `reaberto`, com data, responsável e motivo), exibido na `ModalPedidoCaixa`. Cada movimentação também gera log no histórico do produto: "Quantidade (venda / cancelamento / reabertura PED-000N)".
- **Venda sem estoque, estoque negativo** (pedido do usuário: erros de contagem):
  - o catálogo deixou de bloquear; `SeletorQuantidade.maximo` virou opcional e o selo "Esgotado" saiu;
  - o carrinho avisa "Estoque ficará em -N un.", e a ficha do cliente mostra um aviso de venda sem estoque;
  - a quantidade do produto pode ficar negativa, mas o saldo dos lotes nunca passa de zero; o que falta simplesmente não tem lote.
  - O filtro "Sem estoque" da listagem passou para `quantidade_lte=0`, para incluir os negativos.
  - No `ProdutoForm`, a regra de quantidade ≥ 0 (item 5 da spec) continua no **cadastro**; na **edição** o negativo é aceito, senão um produto negativo não poderia mais ser editado.
- **Clientes recorrentes:** coleção `clientes` (`id`, `nome`, `cpf` só com dígitos, `telefone?`, `criadoEm`), com 5 clientes de exemplo, CPFs válidos gerados (3 começando com 077). `services/clientes.ts`:
  - `buscarClientes("cpf", "077.")` → `cpf_like=^077`, ou seja, **começa com**;
  - `buscarClientes("nome", ...)` → `nome_like`, sem diferenciar maiúsculas, com os caracteres de regex escapados; mínimo de 2 letras, até 6 resultados;
  - `salvarCliente` cria ou atualiza o cliente pelo CPF ao gerar um pedido; sem CPF, não salva.
  - No `ModalCliente`, as sugestões aparecem abaixo do campo sendo digitado (espera de 250 ms), mostram nome, CPF e telefone, e ao tocar preenchem os três campos.
- **Telefone do cliente** (opcional): máscara `(00) 0000-0000` ou `(00) 00000-0000` (`formatarTelefone` / `validarTelefone`), salvo no cliente e mostrado no pedido do caixa.
- **Validado com Playwright (Pixel 7):** produto com 2 un. em 1 lote, venda de 3. Estoque: -1 e lote 0 → cancelado com motivo: 2 e 2 → reaberto: -1 e 0 → pago. Os eventos e os 3 logs estão corretos. Sugestões: "Ricardo Mar" traz 2 clientes; "077." traz 3, com telefone; selecionar preenche tudo. Sem erros. Dados de teste removidos, e o pedido real do usuário (PED-0001) ficou intocado.

### Edição do pedido pelo caixa (pedido do usuário)
O caixa pode, em pedidos **aguardando**, identificar o cliente e incluir CPF na nota (mesmo em pedidos de consumidor não identificado), adicionar e remover itens, alterar quantidades, trocar a forma de pagamento, alterar ou dar desconto e incluir uma observação. Rodapé da `ModalPedidoCaixa`: **Cancelar · Editar · Receber**.

- **`EditorPedido`** (novo): rascunho local, e **nada é gravado até "Salvar alterações"**. Carrega os produtos ativos para mostrar o estoque e avisar "Estoque ficará em -N". A busca de produto usa nome, EAN ou código auxiliar. Tem itens de balcão removíveis, desconto em % ou R$ (pré-carregado em R$ com o valor dado pelo vendedor, máximo de 50%), observação (até 300 caracteres) e o novo total. Não salva um pedido sem itens; nesse caso o caminho é cancelar.
- **`FormularioCliente`** (novo): o corpo do antigo `ModalCliente`, com sugestões por CPF e nome e o telefone, agora reutilizado pelo `ModalCliente` (vendedor) e pelo `EditorPedido` (caixa).
- **`editarPedido`** (`services/vendas.ts`) ajusta o estoque **pela diferença** de cada produto:
  - aumento → `baixarEstoque` (FEFO) e `mesclarBaixas` nos lotes já registrados do item;
  - redução ou remoção → `estornarEstoque` parcial (`planejarEstornoParcial` em `utils/lote.ts`): primeiro devolve a parte que não tinha lote (a que deixou o estoque negativo), depois os lotes na **ordem inversa** da baixa (o último consumido volta primeiro);
  - recalcula subtotal e total, grava o evento `editado` com a descrição legível das mudanças (itens, cliente, pagamento, desconto, observação) e salva o cliente.
  - O cancelamento passou a usar o mesmo estorno com a quantidade total.
- **`Pedido.observacao`** aparece no card (📝) e no detalhe. **`normalizarTexto`** foi para `utils/texto.ts`, compartilhado pela tela de vendas e pelo editor.
- **Bug corrigido:** na tela Caixa, qualquer atualização do pedido (marcar como embalado, adicionar item de balcão) fechava o modal. Agora ele só fecha quando o status muda.
- **Validado com Playwright (Pixel 7):** Alfa com 5 un. (A1=3, A2=2) e Beta com 0. Venda de 2 Alfa → Alfa 3, A1 1. Edição 1 (Alfa 4, +1 Beta, cliente por "077.", dinheiro, R$ 20, observação) → Alfa 1, A1 0, A2 1, Beta -1. Edição 2 (Alfa 1, −Beta) → Alfa 4, A1 2, A2 2, Beta 0. Pagamento recebido. Total final: R$ 100 − 20 = R$ 80. Histórico com as 2 edições descritas. Sem erros. Dados de teste removidos.

### Pedido do caixa virou tela (pedido do usuário)
A `ModalPedidoCaixa` foi substituída pela rota **`src/app/(app)/pedido-caixa.tsx`** (`id` via query param, mesmo padrão de `visualizar-produto`). O conteúdo e as regras são os mesmos (conferência, balcão, editar, cancelar com motivo, reabrir, receber, histórico), agora em `SafeAreaView` com `BarraTopo`, cabeçalho com número e status, `ScrollView` e rodapé fixo com as ações. Estilos em `src/styles/pedido-caixa.styles.ts`.
- Carrega o pedido por `GET /pedidos/:id` no `useFocusEffect`.
- "Voltar" é contextual: em edição, "Sair da edição"; em cancelamento, "Voltar ao pedido"; fora deles, "Voltar ao caixa".
- Depois de **receber** ou **cancelar**, volta à fila (`router.back()`). Ao **reabrir**, ou em qualquer ação que não muda o status, continua na tela.
- A fila do caixa (`caixa.tsx`) só navega (`router.push`) e recarrega sozinha ao ganhar foco.
- Validado com Playwright (Pixel 7): abrir, embalar, entrar e sair da edição, cancelar, abrir pelos cancelados, reabrir e receber. Todas as rotas e retornos estão certos, sem erros.

### PIX fictício e comprovante em PDF (pedido do usuário)
- **Dependências novas** (via `npx expo install`, todas incluídas no Expo Go): `expo-print`, `expo-sharing` (adicionou o config plugin em `app.json`), `react-native-svg`, e `qrcode` (+ `@types/qrcode`, dev). A doc do SDK 57 foi consultada antes: na web, `printToFileAsync` só abre a impressão da **página**, então lá o comprovante vai para um **iframe próprio** com `print()`, onde se escolhe "Salvar como PDF". No iOS/Android é `printToFileAsync` + `Sharing.shareAsync` (PDF de verdade).
- **QR Code do PIX:** `utils/pix.ts` monta um **BR Code válido no formato** (EMV: `26` com `br.gov.bcb.pix` + chave, `54` valor, `59` nome, `60` cidade, `62/05` txid = número do pedido sem hífen, `63` CRC16-CCITT-FALSE, conferido com o vetor padrão "123456789" → `29B1`). Chave, loja e cidade são fictícias (`constants/loja.ts`). `utils/qrcode.ts` usa só o `QRCode.create` (matriz) e gera um path SVG, usado tanto no app (`components/QrCode`, `react-native-svg`) quanto disponível em HTML (`gerarSvgQr`). As cores `qrFundo`/`qrModulo` são iguais nos dois temas, porque o QR precisa ser preto no branco para ser lido.
- **Tela `pedido-caixa`:** pedido **aguardando** em PIX mostra o `PagamentoPix` logo abaixo do cliente, com QR, valor, recebedor, "copia e cola" selecionável e aviso de que é fictício. Ao **receber**, a tela **não volta mais para a fila**: fica no pedido pago, com uma faixa "Venda concluída", e **gera o comprovante automaticamente**. Pedidos pagos têm o botão "Comprovante (PDF)" no rodapé.
- **Comprovante** (`services/comprovante.ts`): HTML com cara de cupom (80 mm, Courier, linhas tracejadas) com os dados fictícios da loja, o aviso "SEM VALOR FISCAL · DADOS FICTÍCIOS", pedido, data/hora do pagamento, vendedor e caixa (do evento `pago`), consumidor/CPF, itens numerados (qtd × unitário = total), serviços de balcão, subtotal, desconto, total, forma de pagamento (e ID da transação e chave, se PIX) e a observação. Todo o texto passa por `escapar()`.
- **Validado com Playwright:** venda de 2 × R$ 249,90 com 10% em PIX → payload com `5406449.82` e CRC; QR renderizado; ao receber, o iframe foi criado com o HTML do cupom (capturado e convertido em PDF pelo Chrome para conferir o layout).

### Aba "Já comprou" na tela de vendas (pedido do usuário)
Quando o comprador é identificado **com CPF**, a tela de vendas ganha uma terceira aba, **"Já comprou"**, com um contador, para o lojista oferecer de novo o que o cliente costuma levar.
- `listarProdutosCompradosPorCliente(cpf)` (`services/vendas.ts`) busca `GET /pedidos?cliente.cpf=<cpf>&status=PAGO` (o json-server 0.17 aceita filtro em campo aninhado, conferido via curl) e agrupa por produto: `vezes` (em quantos pedidos), `quantidadeTotal`, `ultimaCompra` e `ultimoPreco` (tipo `ProdutoComprado`), do mais recente para o mais antigo.
- Cada item usa o próprio `CardProdutoVenda` (nova prop `detalheExtra`): "Comprou N× · X un. · última em DD/MM/AAAA", mais "· pagou R$ Y" quando o preço atual é diferente. O − / + adiciona ao carrinho com o preço e o estoque de hoje. Produto que não está mais ativo ou foi removido aparece como "Produto indisponível para venda", sem botão.
- Cliente com CPF e sem compras pagas mostra "Primeira compra deste cliente".
- O histórico recarrega quando o CPF muda. O estado "carregando" é **derivado** (`historico.cpf !== cpfCliente`), sem `setState` síncrono no efeito (regra `react-hooks/set-state-in-effect`). Se o cliente é removido ou vira anônimo, a aba some, e a aba exibida volta para o catálogo por cálculo (`abaExibida`), também sem efeito.
- Validado com Playwright: sem cliente mostra 2 abas; com Ricardo Martins mostra 3 abas e o detalhe "Comprou 1× · 2 un. · … · pagou R$ 249,90"; o + adiciona ao carrinho; a Mariana (pedido real do usuário, PED-0001) mostra 5 produtos; o Carlos, sem compras, mostra o estado vazio; com consumidor anônimo a aba some e a tela volta ao catálogo. Sem erros.
