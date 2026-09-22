22-09-26-spec-stockflow-mobile-app.md

# Tech Spec / SDD: Sistema Móvel de Gestão de Estoque e Produtos (StockFlow)

**Data:** 22/09/2026

**Escopo:** Frontend

**Módulo:** stockflow

**Contexto de Tela (se aplicável):** `app/(auth)/login.tsx`, `app/(app)/index.tsx`, `app/(app)/novo-produto.tsx`

**Prioridade sugerida:** Alta

---

## 1. Contexto e Problema (Context & Problem Statement)

A gestão manual ou desestruturada de produtos e inventário acarreta inconsistências de contagem, morosidade no fluxo operacional e ausência de rastreabilidade rápida de itens disponíveis para venda. Na arquitetura técnica avaliada, faz-se necessária a existência de um cliente móvel com separação estrita de camadas de apresentação, controle de sessão local e comunicação desacoplada com serviços remotos.

A ausência de uma aplicação móvel estruturada com Expo e TypeScript impede que os operadores consultem, adicionem e excluam produtos diretamente no ponto de operação. A falta de persistência de sessão força autenticações redundantes a cada inicialização, e a inexistência de validação reativa de formulários aumenta o risco de persistência de dados inconsistentes. Não resolver esta lacuna compromete a usabilidade do operador e impede a conformidade integral com os critérios do exame de suficiência de Programação para Dispositivos Móveis (PDM).

---

## 2. Objetivos (Goals)

* Disponibilizar estrutura de navegação segregada por pastas via Expo Router, contendo fluxo público `(auth)` e fluxo restrito `(app)`.


* Centralizar o estado de sessão, dados de utilizador, chave de acesso e operações de login e encerramento de sessão via Context API nativa sem recurso a prop drilling.


* Persistir e restaurar a sessão do operador localmente através do AsyncStorage, permitindo acesso direto à área autenticada e remoção de credenciais no encerramento de sessão.


* Criar componentes modulares e customizados (`CustomInput`, `CustomButton`, `ProductCard`) com tipagem rígida de propriedades em TypeScript e sem a utilização do componente primitivo nativo `Button`.


* Fornecer formulário controlado por estado com campos validados reativamente através de hooks de ciclo de vida e comutador funcional de estado booleano.


* Apresentar mensagens visuais de erro imediatamente abaixo de campos inconsistentes e controlar dinamicamente a ativação do botão de submissão.


* Integrar consumo assíncrono via cliente HTTP centralizado para operações de consulta (`GET`), persistência (`POST`) e remoção (`DELETE`) de registos.


* Renderizar a coleção de dados através de `FlatList` com chaves exclusivas, tratamento visual para coleções vazias e encapsulamento em cartões visuais estruturados.


* Garantir feedback visual contínuo com indicador de atividade durante requisições e caixas de diálogo nativas para sucesso ou falha de conectividade.


* Assegurar conformidade de layout através de áreas seguras, rolagem fluida, posicionamento em Flexbox e isolamento de estilos exclusivamente em arquivos `styles.ts` via `StyleSheet.create`.



---

## 3. Proposta de Solução (Proposed Solution)

### 3.1. Frontend (Next.js & SCSS Modules)

*Nota de Arquitetura: Em conformidade com o ecossistema móvel definido no edital de PDM, a camada de apresentação é implementada em React Native com Expo, Expo Router e TypeScript, utilizando separação por arquivos `styles.ts` via `StyleSheet.create` em vez de Next.js com SCSS Modules.*

* **Camada de Tipos e Contratos (`src/types/index.ts`):**
Declaração de interfaces estruturadas para a entidade do produto (identificador, nome, quantidade, preço unitário, indicador de produto ativo), entidade do utilizador autenticado, contrato de propriedades do `AuthContext` (utilizador, token, indicador de carregamento de sessão, métodos assíncronos de login e logout), e interfaces de propriedades estritas para todos os componentes customizados (`CustomInputProps`, `CustomButtonProps`, `ProductCardProps`).
* **Camada de Serviços e Integração HTTP (`src/services/api.ts`):**
Criação de instância dedicada da biblioteca de comunicação HTTP com definição de tempo limite de espera e endereço base apontando para o servidor de dados do ambiente, exportando o cliente para consumo exclusivo dentro dos serviços ou hooks das telas.


* **Camada de Estado Global (`src/contexts/AuthContext.tsx`):**
Implementação de provedor de autenticação que armazena em memória as credenciais ativas e o token de acesso. Utiliza ciclo de vida na montagem com vetor de dependências vazio para consultar o armazenamento persistente local (`AsyncStorage`), atualizando o estado e permitindo que o roteador posicione a navegação na rota correta. Expõe rotinas para gravação segura e limpeza integral das chaves salvas no encerramento de sessão.


* **Componentes Customizados e Reutilizáveis (`src/components/`):**
* `CustomInput`: Encapsula o campo de entrada de texto nativo, associando um rótulo textual superior, controle do valor fornecido, propagação de alteração textual e exibição de bloco condicional de erro em cor destacada logo abaixo da caixa de entrada. Todo estilo reside em `styles.ts`.


* `CustomButton`: Encapsula elementos de toque interativo (com base em `TouchableOpacity` ou `Pressable`), desprovido do componente nativo `Button`. Suporta estado desabilitado (bloqueio de toque e alteração de opacidade visual) e indicador de atividade (`ActivityIndicator`) em substituição ao texto quando a propriedade de carregamento estiver verdadeira.


* `ProductCard`: Renderiza em formato de cartão estilizado as informações completas do produto (nome em destaque, quantidade disponível, preço formatado, selo de produto ativo/inativo) e incorpora botão de ação para acionamento do gatilho de remoção via identificador.




* **Estrutura de Telas e Navegação (`app/`):**
* `app/_layout.tsx`: Define o ponto de entrada raiz, encapsulando a árvore sob o `AuthProvider` e delegando a navegação condicional conforme o estado de sessão ativa.


* `app/(auth)/_layout.tsx` e `app/(auth)/login.tsx`: Rota pública estruturada com contêiner seguro, logótipo da aplicação renderizado por elemento de imagem nativa, campos controlados de autenticação, botão de confirmação e disparo da função de login do contexto.


* `app/(app)/_layout.tsx`: Layout protegido que impede a exibição caso a chave de acesso ou utilizador não estejam ativos no contexto, redirecionando o fluxo para a área de autenticação.


* `app/(app)/index.tsx`: Tela de catálogo e gestão de itens. Dispara consulta inicial (`GET`) aos registos através do cliente HTTP em hook de montagem. Vincula a coleção resultante a um elemento `FlatList` configurado com chave única por identificador, cartão estruturado (`ProductCard`) na renderização e componente de lista vazia avisando sobre a ausência de registos. Disponibiliza botão de encerramento de sessão e botão para navegação até a tela de criação. Emite requisição de remoção (`DELETE`) vinculada a confirmação visual.


* `app/(app)/novo-produto.tsx`: Tela de formulário com gerenciamento individual de estado para cada campo textual (nome, quantidade, preço) e comutador funcional booleano de disponibilidade. Monitora os valores por meio de hook de ciclo de vida com vetor de dependências atrelado aos campos, ativando o botão de gravação somente sob validação integral de formato e valores mínimos. Aciona requisição de escrita (`POST`) via cliente HTTP e redireciona o operador de volta à listagem após a confirmação de sucesso.





---

## 4. Modelo de Dados (Data Model)

Sem alteração de schema. O escopo abrange o desenvolvimento do cliente móvel consumindo uma API REST com persistência de dados em servidor remoto (ou serviço mockado equivalente), não havendo gestão direta de DDL no banco de dados da aplicação cliente.

---

## 5. Contrato de API (API Contract)

Sem endpoints novos definidos nesta camada. O cliente móvel consome contratos pré-existentes de API REST para as seguintes ações:

* Consulta de itens via método HTTP `GET` sobre o recurso de produtos.


* Persistência de novo item via método HTTP `POST` sobre o recurso de produtos.


* Exclusão de item existente via método HTTP `DELETE` informando o identificador do produto na rota.


* Resposta e tratamento de erros pelo cliente tratam falhas de conectividade e retornos HTTP fora da faixa de sucesso por meio de diálogos nativos do dispositivo.



---

## 6. Impacto e Riscos (Impact & Risks)

* **Risco de Perda de Sincronia de Sessão:** Inconsistência entre a leitura assíncrona do armazenamento local no arranque e a renderização das rotas do Expo Router.


*Mitigação:* Manter indicador booleano de carregamento da sessão no contexto, segurando a renderização das rotas filhas até a finalização da leitura do armazenamento.


* **Risco de Ações Concorrentes no Formulário:** Submissões múltiplas durante a chamada assíncrona de escrita ou remoção de produto.


*Mitigação:* Desabilitar interações de toque e exibir indicador de atividade em destaque durante o processamento das requisições remotas.


* **Risco de Falha de Conectividade com API:** Ocorrência de exceções não tratadas ao tentar efetuar requisições sem conectividade de rede ativa.


*Mitigação:* Tratar todas as chamadas do cliente HTTP com blocos estruturados de captura de erro, notificando o operador através de caixas de diálogo nativas de alerta.


* **Risco de Sobrescrita Visual e Entalhes de Tela:** Quebra de layout em aparelhos com barra de status dinâmica ou entalhe superior (notch).


*Mitigação:* Encapsular as visualizações em contêineres de área segura e barras de rolagem vertical para garantir visualização íntegra em ecrãs com dimensões reduzidas.



---

## 7. Critérios de Aceite (Acceptance Criteria)

* [ ] O projeto não utiliza em nenhuma tela ou componente a tag nativa `Button` do React Native.


* [ ] O código-fonte não possui estilos inline, contendo 100% dos estilos declarados através de `StyleSheet.create` em arquivos dedicados `styles.ts`.


* [ ] A rota pública `app/(auth)/login.tsx` renderiza logótipo institucional, campos de entrada controlados e efetua a transição de sessão com sucesso.


* [ ] A rota `app/(app)/index.tsx` só é acessível quando o contexto de autenticação reportar operador logado.


* [ ] Ao reiniciar o aplicativo com credenciais válidas previamente salvas, o fluxo direciona automaticamente para a listagem sem exigir nova digitação de dados.


* [ ] O acionamento da ação de encerramento de sessão expurga as chaves de persistência local e retorna o operador à tela de autenticação.


* [ ] O formulário de criação em `app/(app)/novo-produto.tsx` possui três campos de texto controlados e um comutador de estado booleano funcional.


* [ ] Nomes de produto com menos de 3 caracteres exibem mensagem visual de erro destacada abaixo do respectivo campo.


* [ ] Quantidades inferiores a zero ou preços menores ou iguais a zero exibem suas respectivas mensagens visuais de erro destacadas.


* [ ] O botão de gravação do formulário permanece desabilitado enquanto houver qualquer campo com erro de validação.


* [ ] A lista de produtos é renderizada obrigatoriamente por meio de `FlatList` com propriedade de chave única associada ao identificador.


* [ ] Quando a lista de produtos retornada da API estiver vazia, uma mensagem informativa amigável é exibida na tela.


* [ ] O acionamento do botão de lixeira no cartão de produto dispara a requisição de remoção remota e atualiza a interface imediatamente.


* [ ] Indicadores de atividade visual (`ActivityIndicator`) são exibidos durante transições e carregamentos assíncronos.


* [ ] Diálogos nativos de alerta notificam conclusões com sucesso e erros de conexão com o servidor remoto.



---

## 8. Plano de Testes (Test Plan)

* **Backend:** Não aplicável diretamente ao código do aplicativo móvel. A validação das rotas HTTP mockadas (`GET`, `POST`, `DELETE`) deve ser confirmada previamente por ferramentas de teste de requisição para garantir respostas consistentes na porta de execução local ou remota.


* **Frontend:**
1. *Fluxo de Inicialização e Sessão:* Abrir o aplicativo sem dados salvos e validar permanência na rota `(auth)/login`. Executar o login, verificar o redirecionamento automático para a rota de listagem e recarregar a aplicação para validar a restauração transparente da sessão via AsyncStorage. Clicar no botão de encerramento de sessão e conferir a exclusão dos dados persistidos e o retorno à tela de login.


2. *Fluxo de Listagem e Exclusão:* Autenticar na aplicação e observar o indicador de carregamento durante a requisição de busca de produtos. Validar a exibição da mensagem de catálogo vazio caso não haja itens gravados. Havendo itens, validar a renderização individual através do cartão customizado. Acionar o botão de exclusão em um cartão e verificar a remoção do item na tela e a persistência da exclusão no servidor.


3. *Fluxo de Validação e Criação de Produto:* Navegar até a tela de formulário de novo produto e tentar submeter com campos em branco, atestando a presença das mensagens de erro destacadas e a inativação do botão de submissão. Preencher valores que desrespeitem as regras mínimas e confirmar o bloqueio contínuo. Inserir dados integralmente válidos, alternar o comutador de produto ativo e validar a liberação do botão de submissão em tempo real. Confirmar o envio, verificar o diálogo de sucesso e checar o redirecionamento automático com o novo item presente na listagem.





---

## 9. Contexto Final da IA (AI Final Context Execution)

Para implementação estrita desta especificação técnica no repositório `stockflow-mobile`, execute a criação e alteração dos arquivos seguindo rigorosamente a ordem estabelecida abaixo, garantindo tipagem TypeScript integral, ausência total de comentários no código gerado, isolamento absoluto de estilos em arquivos `styles.ts` e ausência de componentes nativos primitivos de botão:

1. `src/types/index.ts`: Centralizar todos os contratos de tipos e interfaces de dados e propriedades de componentes.


2. `src/services/api.ts`: Instanciar a configuração base do cliente HTTP.


3. `src/components/CustomInput/styles.ts` e `src/components/CustomInput/index.tsx`: Implementar componente de entrada controlado com suporte a rótulo e erro.


4. `src/components/CustomButton/styles.ts` e `src/components/CustomButton/index.tsx`: Implementar componente de ação interativa com suporte a estados de bloqueio e carregamento.


5. `src/components/ProductCard/styles.ts` e `src/components/ProductCard/index.tsx`: Implementar cartão de apresentação de produto e ação de remoção.


6. `src/contexts/AuthContext.tsx`: Implementar provedor de contexto de autenticação com persistência no armazenamento local.


7. `app/_layout.tsx`: Configurar ponto de entrada raiz com injeção de contexto e controle de rota ativa.


8. `app/(auth)/_layout.tsx`, `app/(auth)/styles.ts` e `app/(auth)/login.tsx`: Construir fluxo público de autenticação.


9. `app/(app)/_layout.tsx`: Estruturar layout de proteção para rotas privadas.


10. `app/(app)/styles.ts` e `app/(app)/index.tsx`: Construir tela de listagem estruturada com requisição e remoção.


11. `app/(app)/novo-produto.styles.ts` e `app/(app)/novo-produto.tsx`: Construir tela de formulário com ciclo de vida reativo e gravação de novo registo.
