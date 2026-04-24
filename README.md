# Juntaê

Plataforma web para conectar pessoas, skills, projetos, vagas e candidaturas, com foco na formação de times para construir projetos reais.

## Estrutura

```
apps/
  api/    # backend — Go + Gin + GORM + PostgreSQL
  web/    # frontend — React + Vite + TypeScript + Tailwind
docker-compose.yml  # bancos de dados (PostgreSQL)
```

## Pré-requisitos

- Go 1.21+
- Node.js 20+
- Docker + Docker Compose

## Subindo os bancos de dados

```bash
docker compose up -d
```

## Rodando a API

```bash
cd apps/api
cp .env.example .env
go run cmd/api/main.go
```

A API ficará disponível em `http://localhost:8080`.

## Rodando o frontend

```bash
cd apps/web
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

## Variáveis de ambiente

Veja `apps/api/.env.example` para as variáveis necessárias na API.
