# Exemplos de Requisições — Juntaê API

Este arquivo reúne exemplos de chamadas para validar o fluxo principal da API.

Os IDs retornados em uma requisição devem ser reutilizados nas próximas etapas. Por exemplo, o `id` retornado ao criar uma skill será usado como `skill_id` na criação de um usuário.

## Ordem sugerida

1. Criar uma skill
2. Criar um usuário associado à skill
3. Criar um projeto com vagas/papéis iniciais
4. Listar as vagas do projeto
5. Criar uma candidatura
6. Consultar os endpoints especiais exigidos pela atividade
7. Verificar os registros de auditoria

---

## 1. Criar uma skill

```bash
curl -s -X POST http://localhost:8080/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name": "Frontend"}' | jq .
```

Resposta esperada:

```json
{
  "id": "<skill_id>",
  "name": "Frontend",
  "created_at": "...",
  "updated_at": "..."
}
```

Guarde o valor de `id` para usar como `skill_id`.

---

## 2. Criar um usuário com skill

Substitua `<skill_id>` pelo ID retornado na etapa anterior.

```bash
curl -s -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Jamilli",
    "email": "maria@example.com",
    "bio": "Frontend engineer interested in hackathons.",
    "city": "Natal",
    "skill_ids": ["<skill_id>"]
  }' | jq .
```

Guarde o valor de `id` para usar como `user_id`.

---

## 3. Criar um projeto com vagas iniciais

Substitua `<user_id>` pelo ID retornado na criação do usuário.

```bash
curl -s -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hackathon RN Match",
    "description": "Projeto para conectar pessoas interessadas em formar times para hackathons no RN.",
    "status": "OPEN",
    "creator_id": "<user_id>",
    "roles": [
      {
        "title": "Backend Developer",
        "description": "Pessoa para construir a API do projeto.",
        "status": "OPEN"
      },
      {
        "title": "UX Designer",
        "description": "Pessoa para ajudar com fluxos e protótipos.",
        "status": "OPEN"
      }
    ]
  }' | jq .
```

Guarde o valor de `id` para usar como `project_id`.

As vagas criadas junto com o projeto podem ser consultadas pelo endpoint:

```bash
curl -s http://localhost:8080/api/project-roles | jq .
```

Copie o `id` de uma das vagas para usar como `project_role_id`.

---

## 4. Criar uma candidatura

Substitua `<user_id>` e `<project_role_id>` pelos IDs obtidos nas etapas anteriores.

```bash
curl -s -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tenho experiência com React e quero contribuir com o frontend do projeto.",
    "status": "PENDING",
    "user_id": "<user_id>",
    "project_role_id": "<project_role_id>"
  }' | jq .
```

Guarde o valor de `id` para usar como `application_id`, caso queira testar busca, atualização ou remoção depois.

---

## 5. Consultar detalhes completos do projeto

Este endpoint carrega o projeto junto com criador, skills do criador, vagas e candidaturas relacionadas.

```bash
curl -s http://localhost:8080/api/projects/<project_id>/details | jq .
```

Ele demonstra o carregamento controlado de relacionamentos com GORM, equivalente ao uso de `JOIN FETCH` no JPA.

---

## 6. Buscar projetos por status e cidade

```bash
curl -s "http://localhost:8080/api/projects/search?status=OPEN&city=Natal" | jq .
```

Este endpoint demonstra uma consulta customizada usando o ORM, relacionando projetos e usuários para filtrar pelo status do projeto e pela cidade do criador.

---

## 7. Contar candidaturas por projeto

```bash
curl -s http://localhost:8080/api/projects/applications-count | jq .
```

Este endpoint demonstra uma consulta SQL nativa com junção entre projetos, vagas e candidaturas.

---

## 8. Verificar logs de auditoria

Toda criação feita na base principal gera um registro na base de auditoria.

```bash
docker exec -it juntae_audit_db psql -U juntae -d juntae_audit -c "SELECT entity_name, entity_id, action, description, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 20;"
```

Exemplo de registros esperados:

```txt
Skill        CREATE
User         CREATE
Project      CREATE
ProjectRole  CREATE
Application  CREATE
```