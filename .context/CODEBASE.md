# Status do Codebase: StockFlow

> Documento vivo — atualizado a cada etapa de implementação. Ver regras em `.context/ARCHITECTURE.md` e a spec em `.context/phase/22-09-26-spec-stockflow-mobile-app.md`.

## Fase Atual
**Fase 1 concluída.** Todos os 11 arquivos da ordem de execução da spec (seção 9) foram criados. `npx tsc --noEmit` e `npx expo lint` passam sem erros.
**Fase 2 concluída.** Backend mock (`json-server`) configurado e testado manualmente (GET/POST/DELETE em `/produtos` confirmados). Fluxo completo (login → listar → criar → ver na lista) validado ponta a ponta com Playwright headless contra o dev server web real.
**Fase 3 concluída.** Funcionalidades além da spec original, pedidas pelo usuário: editar produto, código de barras, descrição, máscara de preço em centavos, selo de "últimas unidades", busca com autocomplete e filtro por status. Ver seção própria abaixo.
**Pendente (pedido pelo usuário, ainda não iniciado):** tela de visualização de produto (com botões de editar/excluir), campos `criadoEm`/`atualizadoEm`, log de alterações (de/para) a cada edição, e uma passada de UX/UI.

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
Removido todo o cluster do template `create-expo-app` (tabs de exemplo) que ficaria órfão ou colidiria em rota com a estrutura da spec: `src/app/index.tsx`, `src/app/explore.tsx`, `src/components/app-tabs*`, `animated-icon*`, `themed-text.tsx`, `themed-view.tsx`, `hint-row.tsx`, `external-link.tsx`, `web-badge.tsx`, `ui/collapsible.tsx`, `constants/theme.ts`, `hooks/use-color-scheme*`, `hooks/use-theme.ts`, `src/global.css`. Confirmado por grep que nenhum arquivo fora desse cluster os referenciava.

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
│       └── editar-produto.tsx   # busca produto por id (query param) e reusa ProdutoForm
├── components/
│   ├── CustomInput/
│   ├── CustomButton/
│   ├── ProductCard/
│   ├── ProdutoForm/              # form compartilhado entre criar/editar
│   └── FiltroProdutos/           # busca com autocomplete + chips de status
├── contexts/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
├── styles/
│   ├── login.styles.ts
│   ├── produtos.styles.ts
│   └── produto-formulario.styles.ts   # compartilhado por novo-produto e editar-produto
├── types/
│   └── index.ts
└── utils/
    └── moeda.ts                 # formatarMoeda, extrairDigitos, formatarCentavosComoTexto
```

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
