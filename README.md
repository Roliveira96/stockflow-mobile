# StockFlow — Controle de Estoque Móvel

Aplicativo móvel para gerenciamento de estoque e catálogo de produtos desenvolvido em React Native com Expo e TypeScript. O projeto foi construído como solução para o Exame de Suficiência da disciplina de Programação para Dispositivos Móveis (PDM).

---

## Demonstração em Vídeo
- **Link da Defesa em Vídeo:** [Adicione o link do vídeo aqui (YouTube / Google Drive)]
> Vídeo de até 15 minutos apresentando a aplicação em execução e demonstrando o cumprimento de cada um dos 10 requisitos da avaliação.

---

## Funcionalidades
- **Autenticação e Sessão:** Login de usuário com persistência de token localmente no dispositivo.
- **Catálogo de Produtos:** Listagem dinâmica sincronizada com servidor remoto via API REST.
- **Cadastro com Validação em Tempo Real:** Formulário com múltiplos campos controlados, chave seletora (Switch) e feedback visual imediato de erros.
- **Remoção de Itens:** Exclusão de registros com sincronização direta na API e atualização do estado local.
- **Resiliência e Feedback Visual:** Indicadores de carregamento (loading) em requisições e alertas visuais de sucesso ou erro.

---

## Tecnologias e Bibliotecas
- [Expo](https://expo.dev/) (SDK 57)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (Navegação baseada em arquivos)
- [Context API](https://react.dev/reference/react/createContext) (Gerenciamento de estado global)
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) (Persistência local)
- [Axios](https://axios-http.com/) (Cliente HTTP)

---

## Cobertura dos 10 Requisitos da Avaliação

1. **Arquitetura de Rotas e Navegação com Expo Router:** Divisão entre fluxo público (`app/(auth)/login.tsx`) e fluxo protegido (`app/(app)/index.tsx` e `app/(app)/novo-produto.tsx`), com transições via `useRouter`.
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

## Configuração do Backend (API REST)

A aplicação consome uma API REST para leitura e escrita dos produtos.

### Opção 1: JSON-Server (Recomendado para testes locais)
1. Instale o json-server globalmente ou na raiz:
   ```bash
   npm install -g json-server
