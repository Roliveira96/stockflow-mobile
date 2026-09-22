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

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Em um terminal, suba o backend mock (veja a seção abaixo):
   ```bash
   npm run mock-api
   ```
3. Em outro terminal, inicie o app:
   ```bash
   npx expo start
   ```

---

## Configuração do Backend (API REST)

A aplicação consome uma API REST para leitura (`GET`), criação (`POST`) e remoção (`DELETE`) de produtos, através da instância Axios em `src/services/api.ts`.

### JSON-Server (mock local, já incluído no projeto)

O `json-server` já está nas `devDependencies` e o seed de dados vive em `db.json` na raiz do projeto.

1. Suba o servidor mock:
   ```bash
   npm run mock-api
   ```
2. A API fica disponível em `http://localhost:3000`, com o recurso `/produtos` já populado. Esse é o endereço padrão que `src/services/api.ts` usa quando `EXPO_PUBLIC_API_URL` não está definida.

### Apontando para outra API

Para usar um backend diferente (remoto ou outra porta local), copie `.env.example` para `.env` e defina a variável de ambiente pública do Expo:

```bash
EXPO_PUBLIC_API_URL=https://sua-api.exemplo.com
```

> **Reinicie `npx expo start` depois de mudar o `.env`** — variáveis `EXPO_PUBLIC_*` são embutidas no bundle na hora da compilação, não lidas em tempo de execução.

### Acessando de outro dispositivo na rede (celular físico, outra máquina)

Se você abrir o app pelo IP da máquina na rede (ex.: `http://192.168.x.x:8081`) em vez de `localhost`, duas coisas precisam mudar:

1. O `json-server` precisa escutar em todas as interfaces, não só `localhost`. O script `npm run mock-api` já faz isso (`--host 0.0.0.0`).
2. O app precisa apontar para o IP da máquina, não para `localhost` (que, do ponto de vista do outro dispositivo, é ele mesmo). Defina no `.env`:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
   ```
   e reinicie `npx expo start`.
