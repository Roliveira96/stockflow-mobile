# Contexto de Arquitetura e Engenharia: StockFlow (Expo + TypeScript)

## 1. Visão do Projeto
O StockFlow é um aplicativo móvel para gestão de estoque e produtos desenvolvido com Expo (SDK 57) e TypeScript.
O desenvolvimento deve cumprir com precisão cirúrgica os 10 requisitos do exame de suficiência de PDM sem adicionar complexidade desnecessária.

---

## 2. Restrições Rígidas de Implementação (Invioláveis)
- Idioma do código e respostas: Português (Brasil).
- Comentários de código: NUNCA inclua comentários em código gerado (TypeScript, TSX ou CSS/estilos). O código deve ser limpo e autoexplicativo.
- Componentes Nativos: Proibido expressamente o uso do componente nativo `Button` rígido do React Native. Utilize exclusivamente `Pressable` ou `TouchableOpacity` encapsulados em componentes customizados.
- Estilização:
  - Proibido qualquer estilo inline (`style={{ ... }}`).
  - 100% dos estilos devem residir em arquivos separados chamados `styles.ts` ao lado do componente/tela, utilizando `StyleSheet.create`.
  - O layout deve ser estruturado com Flexbox, `SafeAreaView` e `ScrollView`.
- Tipagem: TypeScript estrito. Todas as props de componentes, respostas de API e estados devem ter interfaces declaradas em `src/types/index.ts`.
- Estado Global: Uso exclusivo da Context API nativa do React (`AuthContext`). Sem Zustand, Redux ou bibliotecas de terceiros.
- Persistência Local: Utilizar `@react-native-async-storage/async-storage`.
- Comunicação Remota: Utilizar Axios a partir de uma instância centralizada em `src/services/api.ts`.

---

## 3. Estrutura de Diretórios Esperada
```text
stockflow-mobile/
├── app/
│   ├── _layout.tsx              # Root Layout: AuthProvider + Verificação de sessão
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Tela pública com logo e CustomInputs
│   │   └── styles.ts
│   └── (app)/
│       ├── _layout.tsx          # Fluxo protegido
│       ├── index.tsx            # Listagem de produtos (FlatList, GET, DELETE)
│       ├── styles.ts
│       ├── novo-produto.tsx     # Formulário controlado (3 inputs, Switch, validação)
│       └── novo-produto.styles.ts
├── src/
│   ├── components/
│   │   ├── CustomInput/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── CustomButton/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── ProductCard/
│   │       ├── index.tsx
│   │       └── styles.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
```

---

## 4. Cobertura Técnica Obrigatória (Matriz do Edital)

1. Expo Router: Rota pública em `(auth)` e rotas protegidas em `(app)` com navegação fluida via `useRouter`.
2. Context API: `AuthContext` provido na raiz gerenciando `usuario`, `token`, `login()` e `logout()`.
3. AsyncStorage: Armazenamento e restauração da sessão na montagem do app; limpeza de chaves no logout.
4. Componentes Próprios: `CustomInput` (com label e erro), `CustomButton` (com estado de loading e disabled) e `ProductCard`.
5. Formulário Controlado: `useState` gerenciando Nome (min 3 chars), Quantidade (>= 0), Preço (> 0) e 1 `Switch` funcional ("Ativo para Venda").
6. Validação Visual: Exibição de texto de erro em vermelho abaixo de campos inválidos.
7. Hooks (useEffect):
   - Montagem (`[]`): Leitura inicial do storage e chamada inicial `GET /produtos`.
   - Monitoramento: Escuta dos campos do formulário habilitando interativamente o botão de submit.
8. Consumo de API (Axios + FlatList): `GET /produtos` renderizado via `FlatList` com `keyExtractor`, `ListEmptyComponent` e `ProductCard`.
9. Mutações Remotas: `POST /produtos` no formulário e `DELETE /produtos/:id` a partir do card.
10. Feedback Visual: `<ActivityIndicator>` em ações assíncronas e `Alert.alert` para sucesso ou erro.
