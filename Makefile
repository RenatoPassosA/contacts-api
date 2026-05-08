COMPOSE=docker compose

.PHONY: help install dev build start test up up-build down restart logs logs-api logs-db ps shell db-shell db-seed clean prune

help:
	@echo "Comandos disponíveis:"
	@echo "  make install    - Instala dependências localmente"
	@echo "  make dev        - Roda a API localmente em modo desenvolvimento"
	@echo "  make build      - Compila o projeto localmente"
	@echo "  make start      - Roda a API localmente após o build"
	@echo "  make test       - Roda os testes"
	@echo "  make up         - Sobe o ambiente Docker"
	@echo "  make up-build   - Rebuilda e sobe o ambiente Docker"
	@echo "  make down       - Derruba os containers"
	@echo "  make restart    - Reinicia os containers"
	@echo "  make logs       - Mostra logs de todos os containers"
	@echo "  make logs-api   - Mostra logs da API"
	@echo "  make logs-db    - Mostra logs do MySQL"
	@echo "  make ps         - Lista containers"
	@echo "  make shell      - Abre shell no container da API"
	@echo "  make db-shell   - Abre terminal MySQL"
	@echo "  make db-seed    - Popula o banco com dados de exemplo"
	@echo "  make clean      - Derruba containers e remove volumes"
	@echo "  make prune      - Remove recursos Docker não utilizados"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

test:
	npm test

up:
	$(COMPOSE) up -d

up-build:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

logs:
	$(COMPOSE) logs -f

logs-api:
	$(COMPOSE) logs -f api

logs-db:
	$(COMPOSE) logs -f mysql

ps:
	$(COMPOSE) ps

shell:
	$(COMPOSE) exec api sh

db-shell:
	$(COMPOSE) exec mysql mysql -ucontacts_user -pcontacts_password contacts_api

db-seed:
	$(COMPOSE) exec -T mysql mysql -ucontacts_user -pcontacts_password contacts_api < src/database/seed.sql

clean:
	$(COMPOSE) down -v

prune:
	docker system prune -f