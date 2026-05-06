# Juntaê

Plataforma web para conectar pessoas, skills, projetos, vagas e candidaturas no Rio Grande do Norte. O foco é a formação de times para construir projetos reais — hackathons, MVPs, startups e iniciativas acadêmicas.

## Estrutura

```
apps/
  api/    # backend — Go 1.25 + Gin + GORM + PostgreSQL
  web/    # frontend — React + Vite + TypeScript + Tailwind CSS
docker-compose.yml  # dois bancos PostgreSQL (principal + auditoria)
```

## Pré-requisitos

| Ferramenta       | Versão mínima |
| ---------------- | ------------- |
| Go               | 1.21+         |
| Node.js          | 20.19+        |
| Docker + Compose | qualquer LTS  |

---

## Como rodar localmente

### 1. Subir os bancos de dados

```bash
docker compose up -d
```

Isso sobe dois containers PostgreSQL:

| Serviço         | Host      | Porta | Banco        |
| --------------- | --------- | ----- | ------------ |
| juntae_main_db  | localhost | 15432 | juntae_main  |
| juntae_audit_db | localhost | 15433 | juntae_audit |

### 2. Rodar a API

```bash
cd apps/api
cp .env.example .env
go run cmd/api/main.go
```

A API fica disponível em `http://localhost:8080`.

### 3. Rodar o frontend

```bash
cd apps/web
npm install
npm run dev
```

O frontend fica disponível em `http://localhost:5173`.

---

## URLs padrão (local)

| Serviço      | URL                                      |
| ------------ | ---------------------------------------- |
| API          | http://localhost:8080                    |
| Health check | http://localhost:8080/health             |
| Swagger UI   | http://localhost:8080/swagger/index.html |
| Frontend     | http://localhost:5173                    |

---

## Variáveis de ambiente

### API

Veja `apps/api/.env.example` para a lista completa. Variáveis obrigatórias:

| Variável             | Descrição                                                     |
| -------------------- | ------------------------------------------------------------- |
| `APP_PORT`           | Porta da API (padrão: `8080`)                                 |
| `APP_ENV`            | Ambiente: `development`, `staging` ou `production`            |
| `JWT_SECRET`         | Segredo JWT — **obrigatório em staging/production**           |
| `JWT_TTL_HOURS`      | Validade do token em horas (padrão: `24`)                     |
| `MAIN_DATABASE_URL`  | Connection string PostgreSQL para o banco principal           |
| `AUDIT_DATABASE_URL` | Connection string PostgreSQL para o banco de auditoria        |
| `ALLOWED_ORIGINS`    | Origens CORS permitidas, separadas por vírgula (sem wildcard) |

Em `development`, `JWT_SECRET` pode ser omitido — um segredo aleatório é gerado na inicialização (tokens não sobrevivem a reinicializações).

### Frontend

Copie `apps/web/.env.example` para `apps/web/.env` antes de rodar o frontend:

```bash
cp apps/web/.env.example apps/web/.env
```

| Variável       | Descrição                                             |
| -------------- | ----------------------------------------------------- |
| `VITE_API_URL` | URL base da API (padrão: `http://localhost:8080/api`) |
| `VITE_APP_ENV` | Ambiente: `development`, `staging` ou `production`    |

---

## Swagger / OpenAPI

A documentação da API é gerada com [swaggo/swag](https://github.com/swaggo/swag).

**Acessar o Swagger UI:**

```
http://localhost:8080/swagger/index.html
```

**Regenerar a documentação após mudanças nos handlers:**

```bash
cd apps/api
swag init -g cmd/api/main.go -o docs
```

A documentação cobre todos os endpoints: autenticação, usuários, perfil estendido, skills, projetos, vagas, candidaturas e links externos.

---

## Build e deploy

### Build local da API

```bash
cd apps/api
go build -o bin/api ./cmd/api
```

### Build local do frontend

```bash
cd apps/web
npm run build
```

---

## Padrões de desenvolvimento

### Commits

Este repositório usa [Conventional Commits](https://www.conventionalcommits.org/).

```
feat: add user profile endpoint
fix: correct cascade delete on project roles
docs: update swagger annotations
chore: upgrade swaggo to v1.16
```

### Formatação

- **TypeScript/JS/JSON/CSS** — Prettier (`.prettierrc.json`)
- **Go** — `gofmt` via lint-staged

```bash
npm run format
npm run format:check
```

### Hooks (Husky)

| Hook         | O que faz                              |
| ------------ | -------------------------------------- |
| `pre-commit` | Roda lint-staged nos arquivos em stage |
| `commit-msg` | Valida a mensagem com Commitlint       |

---

## Cobertura dos Requisitos Acadêmicos

### RF — Requisitos Funcionais (mínimo 10)

| #   | Requisito                                          | Endpoint / Funcionalidade                    |
| --- | -------------------------------------------------- | -------------------------------------------- |
| 1   | Cadastro de usuário                                | `POST /api/auth/register`                    |
| 2   | Login com e-mail e senha (JWT)                     | `POST /api/auth/login`                       |
| 3   | Editar perfil (nome, bio, cidade, skills)          | `PUT /api/users/{id}`                        |
| 4   | Perfil estendido (headline, disponibilidade)       | `GET/PUT /api/users/me/profile`              |
| 5   | Gerenciar links externos                           | `GET/POST/PUT/DELETE /api/users/me/links`    |
| 6   | Criar, editar e excluir projetos                   | `POST/PUT/DELETE /api/projects`              |
| 7   | Criar, editar e excluir vagas de projeto           | `POST/PUT/DELETE /api/project-roles`         |
| 8   | Candidatar-se a uma vaga                           | `POST /api/applications`                     |
| 9   | Aceitar ou rejeitar candidaturas (dono do projeto) | `PATCH /api/applications/{id}/status`        |
| 10  | Explorar projetos com filtro por status e cidade   | `GET /api/projects?status=OPEN&city=Natal`   |
| 11  | Estatística de candidaturas por projeto (extra)    | `GET /api/projects/stats/applications-count` |

### Entidades mapeadas (mínimo 8)

| Entidade        | Banco | Descrição                                       |
| --------------- | ----- | ----------------------------------------------- |
| User            | main  | Usuário com role (member/admin)                 |
| Skill           | main  | Habilidade/tecnologia                           |
| Project         | main  | Projeto criado por um usuário                   |
| ProjectRole     | main  | Vaga dentro de um projeto                       |
| Application     | main  | Candidatura de usuário a uma vaga               |
| UserLink        | main  | Links externos do usuário (GitHub, LinkedIn...) |
| **UserProfile** | main  | Perfil estendido — headline e disponibilidade   |
| AuditLog        | audit | Log de auditoria (banco separado)               |

**Total: 8 entidades** ✓

### Relacionamentos

| Tipo               | Exemplo                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Um-para-Um         | `User` → `UserProfile` (uniqueIndex em UserID)                                                    |
| Um-para-Muitos     | `User` → `Project`, `Project` → `ProjectRole`, `ProjectRole` → `Application`, `User` → `UserLink` |
| Muitos-para-Muitos | `User` ↔ `Skill` (via tabela `user_skills`)                                                       |

### CRUD implementado (mínimo 6)

| Entidade    | Create | Read |   Update   | Delete |
| ----------- | :----: | :--: | :--------: | :----: |
| User        |   ✓    |  ✓   |     ✓      |   ✓    |
| Skill       |   ✓    |  ✓   |     ✓      |   ✓    |
| Project     |   ✓    |  ✓   |     ✓      |   ✓    |
| ProjectRole |   ✓    |  ✓   |     ✓      |   ✓    |
| Application |   ✓    |  ✓   |     ✓      |   ✓    |
| UserLink    |   ✓    |  ✓   |     ✓      |   ✓    |
| UserProfile |   ✓    |  ✓   | ✓ (upsert) |   —    |

**Total: 7 entidades com CRUD** ✓

### Consultas customizadas

| Consulta                                          | Localização                                            |
| ------------------------------------------------- | ------------------------------------------------------ |
| Projetos filtrados por status + cidade do criador | `ProjectRepository.FindByStatusAndCreatorCityForList`  |
| Contagem de candidaturas por projeto (raw SQL)    | `ProjectRepository.CountApplicationsByProject`         |
| IDs de projetos onde o usuário já candidatou      | `ApplicationRepository.FindProjectIDsWhereUserApplied` |
| Detalhes completos de projeto com preloads        | `ProjectRepository.FindDetailsByID`                    |

### Segurança

| Requisito                      | Implementação                                              |
| ------------------------------ | ---------------------------------------------------------- |
| Autenticação com token         | JWT HS256, claims com UserID e Role (`RequireAuth`)        |
| Perfis de usuário (≥ 2)        | `member` (padrão) e `admin`                                |
| Autorização por perfil         | `RequireRole("admin")` para Create/Update/Delete de skills |
| Proteção de recursos por dono  | Services verificam ownership antes de mutações             |
| CORS sem wildcard              | `CORSMiddleware` com lista de origens explícita            |
| Senhas com hash                | bcrypt via `security.HashPassword`                         |
| Credenciais inválidas sem leak | `ErrInvalidCredentials` retorna 401 genérico               |

### Documentação de API

- Swagger UI: `http://localhost:8080/swagger/index.html`
- Especificação OpenAPI 2.0 gerada com `swaggo/swag`
- Inclui autenticação JWT Bearer, request/response bodies e códigos de erro

### Ambientes e build

| Requisito                    | Como é atendido                                         |
| ---------------------------- | ------------------------------------------------------- |
| Múltiplos ambientes          | `APP_ENV` controla comportamento (JWT secret, logs)     |
| Variáveis de ambiente        | `.env.example` documenta todas as variáveis necessárias |
| Build de produção (API)      | `go build -o bin/juntae-api cmd/api/main.go`            |
| Build de produção (frontend) | `npm run build` → `dist/`                               |
| Bancos de dados              | Docker Compose com dois serviços PostgreSQL 16          |

### Integração com UI

- Rotas protegidas redirecionam para `/login` se não autenticado
- Rotas públicas redirecionam para `/explore` se autenticado
- Todas as mutações chamam a API real (sem estados fake)
- Erros da API são exibidos para o usuário
- TanStack Query gerencia cache e invalidação
