# CRUD de Pessoas — JavaScript, TDD e CI

API REST para cadastrar, consultar, atualizar e excluir pessoas, utilizando **Node.js**, **Express** e práticas de qualidade de software.

## Funcionalidades

- Cadastro de pessoas com **CPF**, **nome** e **data de nascimento**.
- Cálculo automático da idade na consulta dos dados.
- Listagem, busca por CPF, atualização e exclusão.
- Validação de campos obrigatórios, formato do CPF e datas de nascimento.
- Tratamento de erros HTTP (400, 404 e 409).
- Testes automatizados, análise estática, formatação e integração contínua.

> **Limitações:** os dados ficam armazenados somente em memória e são perdidos quando o servidor é reiniciado. O CPF é validado pelo formato de 11 dígitos, **sem validação dos dígitos verificadores**. O projeto oferece uma API REST, não uma interface gráfica.

## Requisitos

- **Node.js 22** (versão usada no GitHub Actions) e npm.
- Git, para clonar o repositório.
- Opcional: Docker, para executar a imagem localmente.

## Instalação

```bash
git clone https://github.com/brunagomess26/crud-pessoas.git
cd crud-pessoas
npm ci
```

## Executar a aplicação

```bash
npm start
```

A API ficará disponível em `http://localhost:3000`. Deixe esse terminal aberto enquanto realiza as requisições em **outro terminal**.

## Endpoints

| Método   | Rota            | Função             | Resposta esperada |
| -------- | --------------- | ------------------ | ----------------- |
| `POST`   | `/pessoas`      | Cadastrar          | `201 Created`     |
| `GET`    | `/pessoas`      | Listar             | `200 OK`          |
| `GET`    | `/pessoas/:cpf` | Consultar pelo CPF | `200 OK`          |
| `PUT`    | `/pessoas/:cpf` | Atualizar          | `200 OK`          |
| `DELETE` | `/pessoas/:cpf` | Excluir            | `204 No Content`  |

### Testar manualmente pelo terminal (Linux/macOS)

**1. Cadastrar pessoa:**

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'
```

Resposta esperada: `201 Created`, com CPF, nome, data de nascimento e idade calculada.

**2. Listar pessoas:**

```bash
curl -i http://localhost:3000/pessoas
```

**3. Consultar pelo CPF:**

```bash
curl -i http://localhost:3000/pessoas/12345678909
```

**4. Atualizar o nome:**

```bash
curl -i -X PUT http://localhost:3000/pessoas/12345678909 \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Maria Oliveira"}'
```

**5. Conferir a atualização:**

```bash
curl -i http://localhost:3000/pessoas/12345678909
```

**6. Excluir:**

```bash
curl -i -X DELETE http://localhost:3000/pessoas/12345678909
```

Resposta esperada: `204 No Content` (sem corpo).

### Testes de erros da API

Execute **após a exclusão** acima:

**Pessoa inexistente — `404 Not Found`:**

```bash
curl -i http://localhost:3000/pessoas/12345678909
```

**Dados inválidos — `400 Bad Request`:**

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"123","nome":"","dataNascimento":"2030-01-01"}'
```

**CPF duplicado — `409 Conflict`:**

```bash
curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'

curl -i -X POST http://localhost:3000/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"cpf":"12345678909","nome":"Maria Silva","dataNascimento":"2000-05-10"}'
```

> Execute os testes de forma sequencial: algumas respostas dependem dos registros criados anteriormente. Para reiniciar com uma lista vazia, interrompa o servidor com `Ctrl+C` e execute `npm start` novamente.

## Testes e qualidade

```bash
npm test                  # Todos os testes (15)
npm run test:unit         # Testes unitários (8)
npm run test:integration  # Testes de integração (7)
npm run lint             # Análise estática (ESLint)
npm run format:check     # Conferência de formatação (Prettier)
npm run format           # Aplica a formatação automaticamente
```

Os testes foram desenvolvidos com a abordagem **TDD (Red → Green → Refactor)**. O histórico de commits registra a escrita dos testes antes das implementações. O **GitHub Actions** executa a análise estática, a verificação de formatação, os testes e a criação da imagem Docker em eventos configurados de `push` e `pull_request`.

## Docker (opcional)

Com Docker instalado e em execução:

```bash
docker build -t crud-pessoas:1.0 .
docker run --rm -p 3000:3000 crud-pessoas:1.0
```

A imagem também é construída automaticamente pelo GitHub Actions. A execução do workflow **não publica a imagem em um registry**.

## Tecnologias

- JavaScript (ES Modules), Node.js 22 e Express
- Vitest e Supertest
- ESLint e Prettier
- Git e GitHub, GitHub Actions, Docker

## Repositório

[brunagomess26/crud-pessoas](https://github.com/brunagomess26/crud-pessoas)
