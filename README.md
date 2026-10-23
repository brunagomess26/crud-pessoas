# CRUD de Pessoas — JavaScript, TDD e CI

Aplicação web para cadastrar, consultar, atualizar e excluir pessoas, desenvolvida com **JavaScript, Node.js e Express**, utilizando desenvolvimento orientado por testes (TDD), controle de versionamento e integração contínua (CI).

O projeto possui uma **interface gráfica responsiva**, desenvolvida com HTML, CSS e JavaScript, integrada a uma API REST.

## Funcionalidades

- Cadastro de pessoas com **CPF**, **nome** e **data de nascimento**.
- Cálculo automático da idade a partir da data de nascimento.
- Listagem e consulta de pessoas cadastradas.
- Atualização de informações cadastrais.
- Exclusão de registros mediante confirmação na interface.
- Validação de campos obrigatórios, formato do CPF e datas de nascimento.
- Tratamento de erros HTTP (400, 404 e 409).
- Mensagens de sucesso e erro conforme a operação realizada.
- Interface responsiva para diferentes tamanhos de tela.
- Testes automatizados, análise estática, formatação e integração contínua.

> **Limitações:** os dados ficam armazenados somente em memória e são perdidos quando o servidor é reiniciado. O CPF é validado pelo formato de 11 dígitos, **sem validação dos dígitos verificadores**. A aplicação não utiliza banco de dados.

## Requisitos

- **Node.js 22** (versão utilizada no GitHub Actions) e npm.
- Git, para clonar o repositório.
- Navegador web atualizado.
- Opcional: Docker, para executar a aplicação em um contêiner.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/brunagomess26/crud-pessoas.git
cd crud-pessoas
```

Instale as dependências:

```bash
npm ci
```

## Executar a aplicação

Inicie o servidor:

```bash
npm start
```

O terminal deverá apresentar:

```text
Servidor rodando na porta 3000
```

Abra o navegador em:

**http://localhost:3000**

A interface será carregada automaticamente.

Mantenha o terminal do servidor aberto enquanto utiliza a aplicação.

## Interface web (Frontend)

A interface foi desenvolvida com **HTML5, CSS3 e JavaScript**, utilizando a função `fetch()` para enviar requisições à API REST.

### Funcionalidades da interface

- Formulário para cadastrar nome, CPF e data de nascimento.
- Tabela com as pessoas cadastradas.
- Exibição da idade calculada automaticamente pelo backend.
- Botão para editar os dados de uma pessoa.
- Botão para excluir um cadastro mediante confirmação.
- Mensagens de sucesso e erro.
- Atualização da listagem após as operações.
- Layout adaptável a diferentes tamanhos de tela.

### Como utilizar

1. Acesse `http://localhost:3000`.
2. Preencha os campos nome, CPF e data de nascimento.
3. Clique em **Cadastrar pessoa**.
4. Consulte o registro na tabela, incluindo a idade calculada.
5. Utilize **Editar** para modificar os dados.
6. Utilize **Excluir** para remover o cadastro.
7. Clique em **Atualizar lista**, caso deseje consultar novamente os registros.

### Organização do frontend

```text
public/
├── index.html    # Estrutura HTML da interface
├── style.css     # Estilização e responsividade
└── script.js     # Interações e comunicação com a API
```

O frontend é disponibilizado pelo próprio servidor Express, utilizando `express.static()`.

## Endpoints da API REST

| Método   | Rota            | Função             | Resposta esperada |
| -------- | --------------- | ------------------ | ----------------- |
| `POST`   | `/pessoas`      | Cadastrar pessoa   | `201 Created`     |
| `GET`    | `/pessoas`      | Listar pessoas     | `200 OK`          |
| `GET`    | `/pessoas/:cpf` | Consultar pelo CPF | `200 OK`          |
| `PUT`    | `/pessoas/:cpf` | Atualizar pessoa   | `200 OK`          |
| `DELETE` | `/pessoas/:cpf` | Excluir pessoa     | `204 No Content`  |

A API pode ser utilizada diretamente por ferramentas HTTP, independentemente da interface gráfica.

## Testar manualmente pelo terminal (Linux/macOS)

Os exemplos abaixo utilizam `curl`.

Mantenha a aplicação em execução com `npm start` e abra outro terminal para realizar as requisições.

### 1. Cadastrar pessoa

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'
```

Resposta esperada: `201 Created`, contendo CPF, nome, data de nascimento e idade calculada.

### 2. Listar pessoas

```bash
curl -i http://localhost:3000/pessoas
```

Resposta esperada: `200 OK`, com os registros cadastrados.

### 3. Consultar pelo CPF

```bash
curl -i http://localhost:3000/pessoas/12345678909
```

Resposta esperada: `200 OK`.

### 4. Atualizar o nome

```bash
curl -i -X PUT http://localhost:3000/pessoas/12345678909 \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Maria Oliveira"}'
```

Resposta esperada: `200 OK`, com os dados atualizados.

### 5. Conferir a atualização

```bash
curl -i http://localhost:3000/pessoas/12345678909
```

O nome retornado deverá ser `Maria Oliveira`.

### 6. Excluir pessoa

```bash
curl -i -X DELETE http://localhost:3000/pessoas/12345678909
```

Resposta esperada: `204 No Content`, sem corpo na resposta.

## Testes de erros da API

### Pessoa inexistente — 404 Not Found

Execute após a exclusão anterior:

```bash
curl -i http://localhost:3000/pessoas/12345678909
```

### Dados inválidos — 400 Bad Request

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"123","nome":"","dataNascimento":"2030-01-01"}'
```

### CPF duplicado — 409 Conflict

Execute o cadastro duas vezes:

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'

curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'
```

A segunda requisição deverá retornar `409 Conflict`.

> **Observação:** alguns testes dependem dos registros criados anteriormente. Para iniciar com uma lista vazia, interrompa o servidor com `Ctrl+C` e execute `npm start` novamente.

## Testes automatizados

O projeto possui **18 testes automatizados**, distribuídos em quatro suítes.

| Categoria                                            | Quantidade |
| ---------------------------------------------------- | ---------: |
| Testes unitários do cálculo de idade                 |          2 |
| Testes unitários do CRUD                             |          6 |
| Testes de integração da API REST                     |          7 |
| Testes de integração da disponibilização do frontend |          3 |
| **Total**                                            |     **18** |

### Executar todos os testes

```bash
npm test
```

### Executar apenas os testes unitários

```bash
npm run test:unit
```

### Executar apenas os testes de integração

```bash
npm run test:integration
```

Os testes utilizam **Vitest** e **Supertest**.

Os testes de integração do frontend verificam a disponibilização dos arquivos HTML, CSS e JavaScript pelo servidor Express. As operações visuais de cadastro, edição e exclusão também foram verificadas manualmente no navegador.

## Desenvolvimento orientado por testes (TDD)

O desenvolvimento utilizou práticas de **Test-Driven Development (TDD)**.

O ciclo de TDD compreende:

1. **RED:** criação do teste antes da implementação, inicialmente sem sucesso.
2. **GREEN:** implementação da funcionalidade necessária para o teste passar.
3. **REFACTOR:** melhoria da estrutura do código, mantendo o comportamento validado pelos testes.

O histórico de commits registra a criação dos testes antes das respectivas implementações, especialmente para o cálculo da idade, o CRUD e a integração da API.

As etapas RED e GREEN estão documentadas nas evidências de desenvolvimento.

## Análise estática e formatação

O projeto utiliza **ESLint** para análise estática e **Prettier** para padronização do código.

### Análise estática

```bash
npm run lint
```

O ESLint possui configurações para:

- Backend em Node.js.
- Testes automatizados.
- Frontend executado no navegador.

### Verificar formatação

```bash
npm run format:check
```

### Aplicar formatação

```bash
npm run format
```

Essas verificações também são executadas automaticamente pelo GitHub Actions.

## Integração contínua — GitHub Actions

O projeto possui um workflow de integração contínua no arquivo:

```text
.github/workflows/ci.yml
```

O workflow é acionado nos eventos configurados de `push` e `pull_request`.

### Etapas do pipeline

1. Checkout do repositório.
2. Configuração do Node.js 22.
3. Instalação das dependências com `npm ci`.
4. Análise estática com ESLint.
5. Verificação de formatação com Prettier.
6. Execução dos testes unitários.
7. Execução dos testes de integração.
8. Construção da imagem Docker após aprovação das verificações de qualidade.

O workflow utiliza dois jobs principais:

- **Analise, Formatacao e Testes**
- **Criar imagem Docker**

A construção da imagem Docker depende da conclusão bem-sucedida do job de qualidade.

## Docker

A aplicação pode ser executada em um contêiner Docker, incluindo o backend Express e a interface web.

### Pré-requisitos

- Docker instalado e em execução.
- Porta 3000 disponível.

### 1. Construir a imagem

Na raiz do projeto:

```bash
docker build -t crud-pessoas:1.0 .
```

O Dockerfile utiliza uma imagem baseada no Node.js 22 Alpine e copia os arquivos necessários da aplicação.

### 2. Verificar a imagem

```bash
docker images crud-pessoas
```

A listagem deverá apresentar a imagem `crud-pessoas`, com a tag `1.0`.

### 3. Iniciar o contêiner

```bash
docker run -d \
  --name crud-pessoas-container \
  -p 3000:3000 \
  crud-pessoas:1.0
```

A aplicação ficará disponível em:

**http://localhost:3000**

A página inicial apresentará a interface gráfica de cadastro.

### 4. Verificar a execução

Listar os contêineres em execução:

```bash
docker ps
```

Consultar os logs:

```bash
docker logs crud-pessoas-container
```

Mensagem esperada:

```text
Servidor rodando na porta 3000
```

### 5. Testar a aplicação no Docker

Abra `http://localhost:3000` no navegador para utilizar a interface.

Também é possível testar a API diretamente pelo terminal.

Cadastrar uma pessoa:

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'
```

Resposta esperada: `201 Created`.

Consultar os registros:

```bash
curl -i http://localhost:3000/pessoas
```

Resposta esperada: `200 OK`.

### 6. Encerrar o contêiner

```bash
docker stop crud-pessoas-container
```

Para remover o contêiner:

```bash
docker rm crud-pessoas-container
```

A remoção do contêiner não exclui a imagem Docker.

Como o projeto utiliza armazenamento em memória, os registros não persistem após a reinicialização da aplicação.

### Docker no GitHub Actions

O workflow de CI também constrói automaticamente a imagem Docker após a aprovação das verificações.

A imagem construída no GitHub Actions permanece no ambiente temporário de execução e **não é publicada automaticamente em um registry**.

## Estrutura do projeto

```text
crud-pessoas/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/
│   ├── app.js
│   ├── idade.js
│   ├── pessoas.service.js
│   └── server.js
├── testes/
│   ├── unit/
│   │   ├── idade.test.js
│   │   └── pessoas.test.js
│   └── integration/
│       ├── frontend.test.js
│       └── pessoas.test.js
├── Dockerfile
├── .dockerignore
├── .gitignore
├── eslint.config.js
├── .prettierrc
├── package.json
├── package-lock.json
└── README.md
```

## Tecnologias utilizadas

- **Frontend:** HTML5, CSS3 e JavaScript.
- **Backend:** Node.js 22 e Express.
- **Linguagem:** JavaScript com ES Modules.
- **Testes:** Vitest e Supertest.
- **Análise estática:** ESLint.
- **Formatação:** Prettier.
- **Versionamento:** Git e GitHub.
- **Integração contínua:** GitHub Actions.
- **Contêineres:** Docker.

## Repositório

[brunagomess26/crud-pessoas](https://github.com/brunagomess26/crud-pessoas)
