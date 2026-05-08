# contacts-api

API REST para gerenciamento de contatos, construída com Node.js, Express e TypeScript, utilizando MySQL como banco de dados.

## Funcionalidades

- Criar contato
- Listar contatos
- Atualizar contato
- Excluir contato
- Validar dados de entrada
- Persistir contatos em banco de dados MySQL
- Executar a aplicação com Docker
- Subir API e banco MySQL com Docker Compose
- Popular o banco com dados de exemplo via seed
- Automatizar comandos comuns com Makefile

## Tecnologias

- Node.js + TypeScript
- Express
- MySQL2
- Zod
- dotenv
- tsx
- Jest
- Docker
- Docker Compose
- Makefile

## Pré-requisitos

O projeto pode ser executado de duas formas:

1. Localmente, usando Node.js e MySQL instalados na máquina.
2. Com Docker, usando Docker Compose para subir a API e o banco MySQL.

### Para execução local

É necessário ter instalado:

- Node.js 18+
- npm
- MySQL 8+

### Para execução com Docker

É necessário ter instalado:

- Docker
- Docker Compose v2, disponível pelo comando:

```bash
docker compose version
```

> Observação: em algumas instalações antigas, o comando pode ser `docker-compose`. Este projeto utiliza por padrão `docker compose`.

## Estrutura do projeto

```txt
src/
  __tests__/
  config/
  database/
    init.sql
    seed.sql
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

Dockerfile
docker-compose.yml
Makefile
.dockerignore
.env.example
```

## Configuração local

### 1. Clone o repositório e instale as dependências

```bash
git clone https://github.com/RenatoPassosA/contacts-api
cd contacts-api
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=contacts_api
```

Ajuste os valores conforme a configuração do seu MySQL local.

### 3. Configure o banco de dados local

Para criar o banco de dados e a tabela `contacts`, execute:

```bash
sudo mysql -N < src/database/init.sql
```

Caso prefira executar com um usuário específico do MySQL, utilize:

```bash
mysql -u seu_usuario -p -N < src/database/init.sql
```

O script cria o banco `contacts_api`, caso ele ainda não exista, e também cria a tabela `contacts`, caso ela ainda não exista.

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

## Rodando localmente

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

A API ficará disponível em:

```txt
http://localhost:3000
```

## Rodando com Docker

O projeto possui um `Dockerfile` para build da API e um `docker-compose.yml` para subir o ecossistema completo com:

- API Node.js/Express
- Banco MySQL 8.4
- Volume persistente para o banco
- Network interna entre API e MySQL
- Healthcheck do MySQL
- Script de inicialização do banco

### Subir API e banco

```bash
make up-build
```

Esse comando constrói a imagem da API e sobe os containers em segundo plano.

Depois, verifique se os containers estão rodando:

```bash
make ps
```

A saída esperada deve conter os serviços `api` e `mysql` rodando. O MySQL deve aparecer como `healthy`.

### Testar se a API está no ar

```bash
curl -i http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok","service":"contatos-api"}
```

### Listar contatos

Logo após subir o ambiente do zero, a tabela pode estar vazia:

```bash
curl -i http://localhost:3000/contatos
```

Resposta esperada antes do seed:

```json
[]
```

## Portas no Docker

No ambiente Docker, a API fica disponível em:

```txt
http://localhost:3000
```

O MySQL fica disponível externamente na porta `3307`:

```txt
localhost:3307
```

Dentro da rede Docker, a API acessa o banco usando:

```env
DB_HOST=mysql
DB_PORT=3306
```

Isso evita conflito com um MySQL local que já esteja usando a porta `3306`.

## Populando o banco com seed

O projeto possui um arquivo de seed em:

```txt
src/database/seed.sql
```

Para popular o banco com dados de exemplo, execute:

```bash
make db-seed
```

Depois, liste os contatos:

```bash
curl -i http://localhost:3000/contatos
```

Resposta esperada: uma lista com contatos cadastrados.

Também é possível conferir diretamente no banco:

```bash
docker compose exec mysql mysql -ucontacts_user -pcontacts_password contacts_api -e "SELECT * FROM contacts;"
```

> Observação: o MySQL pode exibir o aviso `Using a password on the command line interface can be insecure`. Para este ambiente local de desenvolvimento, esse aviso não impede o funcionamento.

## Comandos do Makefile

O projeto possui um `Makefile` para facilitar os comandos mais comuns.

### Ver comandos disponíveis

```bash
make help
```

### Comandos locais

```bash
make install
```

Instala as dependências localmente.

```bash
make dev
```

Roda a API localmente em modo desenvolvimento.

```bash
make build
```

Compila o projeto TypeScript.

```bash
make start
```

Roda a API compilada.

```bash
make test
```

Executa os testes automatizados.

### Comandos Docker

```bash
make up
```

Sobe os containers.

```bash
make up-build
```

Rebuilda a imagem da API e sobe os containers.

```bash
make down
```

Derruba os containers.

```bash
make restart
```

Reinicia o ambiente Docker.

```bash
make ps
```

Lista os containers do projeto.

```bash
make logs
```

Mostra os logs de todos os containers.

```bash
make logs-api
```

Mostra os logs da API.

```bash
make logs-db
```

Mostra os logs do MySQL.

```bash
make shell
```

Abre um terminal dentro do container da API.

```bash
make db-shell
```

Abre o terminal MySQL dentro do container do banco.

```bash
make db-seed
```

Popula o banco com dados de exemplo.

```bash
make clean
```

Derruba os containers e remove os volumes do banco.

```bash
make prune
```

Remove recursos Docker não utilizados.

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
  -d '{"nome": "Joao Silva", "telefone": "11999999999"}'
```

**Resposta 201:**

```json
{
  "id": 1,
  "nome": "Joao Silva",
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
    "nome": "Joao Silva",
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
  -d '{"nome": "Joao Santos"}'
```

**Resposta 200:**

```json
{
  "id": 1,
  "nome": "Joao Santos",
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

### Nome

- Obrigatório
- Deve conter no mínimo duas palavras
- Cada palavra deve ter pelo menos 3 letras

### Telefone

- Obrigatório
- Aceita os formatos:
  - `11999999999`
  - `(11) 99999-9999`
  - `+55 11 99999-9999`
- Deve ter 10 ou 11 dígitos, sem considerar o DDI
- Deve ter no máximo 20 caracteres

## Testes automatizados

Para executar os testes:

```bash
npm test
```

Ou usando Makefile:

```bash
make test
```

Resultado esperado:

```txt
Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
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
  -d '{"nome":"Joao Silva","telefone":"11999999999"}'
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
  -d '{"nome":"Joao Santos","telefone":"11988887777"}'
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
  -d '{"nome":"Joao","telefone":"11999999999"}'
```

Esperado: status `400`.

### 7. Testar telefone inválido

```bash
curl -i -X POST http://localhost:3000/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Joao Silva","telefone":"123"}'
```

Esperado: status `400`.

### 8. Testar ID inválido

```bash
curl -i -X PATCH http://localhost:3000/contatos/abc \
  -H "Content-Type: application/json" \
  -d '{"nome":"Joao Santos"}'
```

Esperado: status `400`.

### 9. Testar contato inexistente

```bash
curl -i -X DELETE http://localhost:3000/contatos/99999
```

Esperado: status `404`.

## Observações importantes

- No Docker, a API acessa o banco pelo host `mysql`, e não por `localhost`.
- No Docker, o MySQL é exposto externamente em `localhost:3307`.
- Localmente, o `.env` pode usar `DB_HOST=localhost` e `DB_PORT=3306`.
- O script `init.sql` cria o banco e a tabela.
- O script `seed.sql` popula o banco com dados de exemplo.
- O comando `make clean` remove o volume do banco; portanto, os dados serão apagados.
- Caso a porta `3306` já esteja em uso na máquina local, isso não afeta o Docker, pois o MySQL do Compose usa a porta externa `3307`.
