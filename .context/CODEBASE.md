# Status do Codebase: StockFlow

> Documento vivo — atualizado a cada etapa de implementação. Ver regras em `.context/ARCHITECTURE.md` e a spec em `.context/phase/22-09-26-spec-stockflow-mobile-app.md`.

## Fase Atual
**Fase 1 concluída.** Todos os 11 arquivos da ordem de execução da spec (seção 9) foram criados. `npx tsc --noEmit` e `npx expo lint` passam sem erros.

## Decisão de Implementação: Autenticação
A spec (seção 5) só define contrato de API para `produtos` (GET/POST/DELETE); não há endpoint de autenticação especificado. Assumindo que o login é validado localmente no `AuthContext` (campos não vazios) e um token é gerado no cliente para fins do exame, já que não há backend de auth definido. Ajustar se um contrato real de login surgir.

## Configuração de Ambiente
`src/services/api.ts` lê `EXPO_PUBLIC_API_URL` (padrão Expo para variáveis públicas). Sem esse valor definido em `.env`, cai para `http://localhost:3000` (porta padrão do `json-server`).

## Nota de Convenção
A spec (seção 9) referencia caminhos como `app/_layout.tsx`, `app/(auth)/...`, `app/(app)/...`. Este projeto usa **`src/app/`** como raiz de rotas (Expo Router), conforme `AGENTS.md` e a estrutura real do repositório. Todos os caminhos da spec devem ser lidos com o prefixo `src/` adicionado.

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
│   └── _layout.tsx        # Stack.Protected por token de auth, splash controlado por carregandoSessao
├── components/
│   ├── CustomInput/
│   ├── CustomButton/
│   └── ProductCard/
├── contexts/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

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
- `src/app/(app)/novo-produto.tsx` — 3 campos controlados (nome/quantidade/preço) com validação reativa em `useEffect` por campo (regra: nome ≥ 3 chars, quantidade ≥ 0, preço > 0) e `Switch` de "Ativo para venda"; botão de salvar desabilitado até formulário válido; `POST /produtos` com feedback via `Alert.alert` e retorno à listagem em caso de sucesso. **Nota:** os 3 `useEffect` de validação por campo violam a regra de lint `react-hooks/set-state-in-effect`; mantidos por decisão explícita do usuário porque o requisito 6 do edital exige literalmente um "efeito de monitoramento" via `useEffect`. Cada `setState` correspondente tem um `// eslint-disable-next-line` pontual — única exceção à regra de "nenhum comentário" do `ARCHITECTURE.md`, por ser diretiva de ferramenta, não explicação de código.
