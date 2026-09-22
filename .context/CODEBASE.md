# Status do Codebase: StockFlow

> Documento vivo — atualizado a cada etapa de implementação. Ver regras em `.context/ARCHITECTURE.md` e a spec em `.context/phase/22-09-26-spec-stockflow-mobile-app.md`.

## Fase Atual
**Fase 1 em andamento.** Dependências instaladas (`axios`, `@react-native-async-storage/async-storage`) e camada de tipos/serviço HTTP criada.

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
- [ ] `src/app/(auth)/_layout.tsx`, `styles.ts`, `login.tsx`
- [ ] `src/app/(app)/_layout.tsx`
- [ ] `src/app/(app)/styles.ts`, `index.tsx`
- [ ] `src/app/(app)/novo-produto.styles.ts`, `novo-produto.tsx`

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
