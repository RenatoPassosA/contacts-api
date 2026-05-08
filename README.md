# contacts-api

API REST para gerenciamento de contatos, construída com Node.js, Express e TypeScript, utilizando MySQL como banco de dados.

## Funcionalidades

- Criar contato
- Listar contatos
- Atualizar contato
- Excluir contato
- Validar dados de entrada
- Persistir contatos em banco de dados MySQL

## Tecnologias

- Node.js + TypeScript
- Express
- MySQL2
- Zod (validação)
- dotenv
- tsx (desenvolvimento)

## Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js 18+
- npm
- MySQL 8+

## Configuração

### 1. Clone o repositório e instale as dependências

```bash
git clone https://github.com/RenatoPassosA/contacts-api
cd contacts-api
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`::

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=contacts_api
```

Ajuste os valores conforme a configuração do seu MySQL local.

### 3. Configure o banco de dados

Para criar o banco de dados e a tabela `contacts`, execute:

```bash
sudo mysql -N < src/database/init.sql
```

O script cria o banco `contacts_api`, caso ele ainda não exista, e também cria a tabela `contacts`, caso ela ainda não exista.

Caso prefira executar com um usuário específico do MySQL, utilize:

```bash
mysql -u seu_usuario -p -N < src/database/init.sql
```

A tabela criada possui a seguinte estrutura:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Rodando o projeto

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## Rotas

| Método   | Rota             | Descrição                    |
|----------|------------------|------------------------------|
| `GET`    | `/health`        | Verifica se a API está no ar |
| `POST`   | `/contatos`      | Cria um novo contato         |
| `GET`    | `/contatos`      | Lista todos os contatos      |
| `PATCH`  | `/contatos/:id`  | Atualiza um contato          |
| `DELETE` | `/contatos/:id`  | Remove um contato            |

## Exemplos de uso

### Criar contato

```bash
curl -X POST http://localhost:3000/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "telefone": "11999999999"}'
```

**Resposta 201:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "telefone": "11999999999",
  "createdAt": "2026-05-07T13:55:24.000Z",
  "updatedAt": "2026-05-07T13:55:24.000Z"
}
```

### Listar contatos

```bash
curl http://localhost:3000/contatos
```

**Resposta 200:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "telefone": "11999999999",
    "createdAt": "2026-05-07T13:55:24.000Z",
    "updatedAt": "2026-05-07T13:55:24.000Z"
  }
]
```

### Atualizar contato

```bash
curl -X PATCH http://localhost:3000/contatos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Santos"}'
```

**Resposta 200:**
```json
{
  "id": 1,
  "nome": "João Santos",
  "telefone": "11999999999",
  "createdAt": "2026-05-07T13:55:24.000Z",
  "updatedAt": "2026-05-07T13:56:18.000Z"
}
```

### Remover contato

```bash
curl -X DELETE http://localhost:3000/contatos/1
```

**Resposta:** `204 No Content`

## Validações

**Nome:**
- Obrigatório
- Mínimo de duas palavras, cada uma com pelo menos 3 letras

**Telefone:**
- Obrigatório
- Aceita os formatos: `11999999999`, `(11) 99999-9999`, `+55 11 99999-9999`
- Deve ter 10 ou 11 dígitos (sem o DDI)
- Máximo de 20 caracteres

## Testes automatizados

Para executar os testes:

```bash
npm test
```

## Testes manuais com curl

Com a API rodando, teste nesta ordem.

### 1. Health check

```bash
curl http://localhost:3000/health
```

Esperado:

```json
{"status":"ok","service":"contatos-api"}
```

### 2. Criar contato

```bash
curl -i -X POST http://localhost:3000/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","telefone":"11999999999"}'
```

Esperado: status `201` e o contato criado.

### 3. Listar contatos

```bash
curl -i http://localhost:3000/contatos
```

Esperado: status `200` e uma lista contendo os contatos cadastrados.

### 4. Atualizar contato

Use o `id` retornado no cadastro. Exemplo com `id` igual a `1`:

```bash
curl -i -X PATCH http://localhost:3000/contatos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Santos","telefone":"11988887777"}'
```

Esperado: status `200` e contato atualizado.

### 5. Excluir contato

```bash
curl -i -X DELETE http://localhost:3000/contatos/1
```

Esperado:

```txt
HTTP/1.1 204 No Content
```

### 6. Testar nome inválido

```bash
curl -i -X POST http://localhost:3000/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","telefone":"11999999999"}'
```

Esperado: status `400`.

### 7. Testar ID inválido

```bash
curl -i -X PATCH http://localhost:3000/contatos/abc \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Santos"}'
```

Esperado: status `400`.

### 8. Testar contato inexistente

```bash
curl -i -X DELETE http://localhost:3000/contatos/99999
```

Esperado: status `404`.

## Estrutura do projeto

```txt
src/
  __tests__/
  config/
  database/
  errors/
  middlewares/
  modules/
    contacts/
      controller.ts
      mysql.repository.impl.ts
      repository.ts
      routes.ts
      schema.ts
      types.ts
      usecases.ts
  app.ts
  server.ts
```

## Checklist de execução

Antes de avaliar a aplicação, execute:

```bash
npm install
```

```bash
sudo mysql -N < src/database/init.sql
```

```bash
npm test
```

```bash
npm run dev
```

Depois, acesse:

```txt
http://localhost:3000/health
```
