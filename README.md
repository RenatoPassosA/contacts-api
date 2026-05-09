# contacts-api

API REST para gerenciamento de contatos, desenvolvida com Node.js, Express, TypeScript e MySQL.

A aplicação permite criar, listar, atualizar e excluir contatos, aplicando validações nos dados de entrada e persistindo as informações em um banco de dados MySQL.

## Funcionalidades

- Criar contato
- Listar contatos
- Atualizar contato
- Excluir contato
- Validar nome e telefone
- Persistir contatos em banco MySQL
- Executar localmente ou com Docker
- Executar testes automatizados

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- MySQL
- MySQL2
- Zod
- dotenv
- Jest
- Docker
- Docker Compose
- Makefile

## Estrutura principal

```txt
src/
  adapters/http/
  application/usecases/
  config/
  database/
  domain/
  errors/
  infra/mysql/
  middlewares/
  app.ts
  server.ts
```

## Configuração local

### 1. Clone o repositório

```bash
git clone https://github.com/RenatoPassosA/contacts-api
cd contacts-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env`

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=contacts_api
```

O usuário informado em `DB_USER` precisa existir no MySQL e possuir permissão de acesso ao banco `contacts_api`.

O arquivo `.env` não deve ser versionado.

## Banco de dados

O projeto possui um script para criar o banco de dados e a tabela `contacts`:

```txt
src/database/init.sql
```

No Linux/WSL, caso o MySQL utilize autenticação via `sudo`, execute:

```bash
sudo mysql -N < src/database/init.sql
```

Ou, usando um usuário MySQL com permissão para criar banco de dados e tabelas:

```bash
mysql -u usuario_admin_mysql -p -N < src/database/init.sql
```

O script cria o banco `contacts_api`, caso ele não exista, e cria a tabela `contacts`, caso ela não exista.

Estrutura da tabela:

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

Para iniciar a aplicação em modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

Para compilar e rodar a versão de produção:

```bash
npm run build
npm start
```

## Rodando com Docker

Também é possível subir a API e o banco MySQL com Docker Compose.

```bash
make up-build
```

Esse comando constrói a imagem da API e sobe os containers em segundo plano.

Verifique os containers:

```bash
make ps
```

A API ficará disponível em:

```txt
http://localhost:3000
```

No Docker, o MySQL fica disponível externamente em:

```txt
localhost:3307
```

Dentro da rede Docker, a API acessa o banco com:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=contacts_user
DB_PASSWORD=contacts_password
DB_NAME=contacts_api
```

Para derrubar os containers:

```bash
make down
```

Para derrubar os containers e remover o volume do banco:

```bash
make clean
```

Atenção: `make clean` remove os dados salvos no banco.

## Makefile

O projeto possui um `Makefile` para facilitar a execução dos comandos.

Ver comandos disponíveis:

```bash
make help
```

Comandos principais:

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

Compila o projeto.

```bash
make start
```

Roda a versão compilada.

```bash
make test
```

Executa os testes automatizados.

```bash
make up-build
```

Rebuilda e sobe a API e o banco com Docker.

```bash
make down
```

Derruba os containers.

```bash
make logs
```

Mostra os logs dos containers.

```bash
make db-shell
```

Abre o terminal MySQL dentro do container do banco.

```bash
make db-seed
```

Popula o banco com dados de exemplo.

## Seed do banco

O projeto possui um script opcional para popular a tabela `contacts`:

```txt
src/database/seed.sql
```

Com Docker:

```bash
make db-seed
```

Localmente:

```bash
mysql -u seu_usuario_mysql -p contacts_api < src/database/seed.sql
```

Ou, no Linux/WSL com autenticação via `sudo`:

```bash
sudo mysql contacts_api < src/database/seed.sql
```

## Testes

Para executar os testes automatizados:

```bash
npm test
```

Ou:

```bash
make test
```

Resultado esperado:

```txt
Test Suites: 3 passed, 3 total
Tests:       27 passed, 27 total
```