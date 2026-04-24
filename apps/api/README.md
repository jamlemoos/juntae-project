# Juntaê API

API REST em Go para a plataforma Juntaê — conecta pessoas, skills, projetos e candidaturas.

**Stack:** Go · Gin · GORM · PostgreSQL · Docker Compose · go-playground/validator

---

## Estrutura

```
cmd/api/main.go          entry point
internal/
  config/                variáveis de ambiente
  database/              conexões e migrations
  domain/
    model/               entidades GORM
    dto/                 request/response types
    handler/             controllers HTTP
    service/             regras de negócio
    repository/          acesso a dados
  router/                registro de rotas
  validation/            validação de DTOs
docs/
  postman/               collection Postman
  examples/requests.md   exemplos curl
```

---

## Bases de dados

| Base | Banco | Porta |
|---|---|---|
| Principal | `juntae_main` | 15432 |
| Auditoria | `juntae_audit` | 15433 |

Toda operação de criação na base principal gera automaticamente um `audit_log` na base de auditoria.

---

## Rotas

```
GET  /health

POST/GET/PUT/DELETE  /api/skills
POST/GET/PUT/DELETE  /api/users
POST/GET/PUT/DELETE  /api/projects
POST/GET/PUT/DELETE  /api/project-roles
POST/GET/PUT/DELETE  /api/applications

GET  /api/projects/:id/details
GET  /api/projects/search?status=OPEN&city=Natal
GET  /api/projects/applications-count
```

---

## Como executar

```bash
docker compose up -d

cp .env.example .env

cd apps/api
go run ./cmd/api
```

API disponível em `http://localhost:8080`.

---

## Verificar tabelas

```bash
docker exec -it juntae_main_db psql -U juntae -d juntae_main -c '\dt'

docker exec -it juntae_audit_db psql -U juntae -d juntae_audit -c '\dt'
```

---

## Postman

Collection em `docs/postman/juntae-api.postman_collection.json`.  
Exemplos curl em `docs/examples/requests.md`.