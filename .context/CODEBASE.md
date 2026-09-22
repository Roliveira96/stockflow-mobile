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
│   └── TabelaLotes/              # lista de lotes com selo de status (regular/vencendo/vencido)
├── constants/
│   └── theme.ts                  # tokens: cores, espacamento, raios, ALVO_TOQUE_MINIMO, sombra
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useCampoMoeda.ts          # mascara de centavos reutilizavel (preco do produto + custo do lote)
├── services/
│   └── api.ts
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
    └── lote.ts                  # status do lote, custo medio ponderado, margem, preco sugerido
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
- **`ProductCard`:** nome agora é clicável (abre a visualização) e ganhou um terceiro botão "Visualizar" ao lado de Editar/Remover.
