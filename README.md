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

---

## Padrões de desenvolvimento

### Commits

Este repositório usa [Conventional Commits](https://www.conventionalcommits.org/).  
O formato é validado automaticamente pelo Commitlint no hook `commit-msg`.

```
feat: add user search endpoint
fix: correct cascade delete on project roles
docs: update API README
chore: configure husky hooks
refactor: extract audit log logic into service
test: add unit tests for application service
style: format files with prettier
ci: add github actions workflow
build: update go dependencies
```

### Formatação

- **TypeScript/JS/JSON/Markdown/CSS** — Prettier (configurado em `.prettierrc`)
- **Go** — `gofmt` (aplicado automaticamente pelo lint-staged)

Formatar manualmente:

```bash
npm run format
```

Verificar sem alterar:

```bash
npm run format:check
```

### Hooks (Husky)

| Hook         | O que faz                                  |
| ------------ | ------------------------------------------ |
| `pre-commit` | Roda `lint-staged` nos arquivos em stage   |
| `commit-msg` | Valida a mensagem de commit com Commitlint |

### Backend

```bash
cd apps/api
go test ./...
```
