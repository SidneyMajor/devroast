# Especificação - Drizzle ORM com Docker Compose

## Visão Geral

Este documento especifica a implementação do Drizzle ORM com PostgreSQL usando Docker Compose para o projeto DevRoast.

## Stack

- **Database**: PostgreSQL 16-alpine
- **ORM**: Drizzle ORM 0.39
- **Container**: Docker Compose
- **Casing**: snake_case (configurado via `schemaFilter`)

## Tabelas

### 1. `submissions`

Armazena as submissões de código dos usuários.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| code | text | NOT NULL |
| language | language_enum | NOT NULL, DEFAULT 'javascript' |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |

### 2. `roasts`

Armazena o feedback/roast gerado para cada submissão.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| submission_id | uuid | NOT NULL, FK → submissions(id) |
| feedback | text | NOT NULL |
| score | decimal(3,2) | NOT NULL |
| roast_mode | boolean | NOT NULL, DEFAULT true |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |

### 3. `issues`

Armazena os problemas encontrados no código (cards de feedback).

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| roast_id | uuid | NOT NULL, FK → roasts(id) |
| severity | severity_enum | NOT NULL |
| title | text | NOT NULL |
| description | text | NOT NULL |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |

### 4. `diffs`

Armazena as sugestões de correção do código.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| roast_id | uuid | NOT NULL, FK → roasts(id) |
| diff_type | diff_type_enum | NOT NULL |
| content | text | NOT NULL |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |

### 5. `stats`

Armazena estatísticas globais do sistema.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| total_submissions | decimal(10,0) | NOT NULL, DEFAULT 0 |
| avg_score | decimal(3,2) | NOT NULL, DEFAULT 0 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() |

## Enums

### 1. `language`

```typescript
export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "sql",
  "html",
  "css",
  "other",
]);
```

### 2. `severity`

```typescript
export const severityEnum = pgEnum("severity", [
  "critical",
  "warning",
  "good",
  "verdict",
]);
```

### 3. `diff_type`

```typescript
export const diffTypeEnum = pgEnum("diff_type", [
  "added",
  "removed",
  "context",
]);
```

## Docker Compose

### Services

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast_password
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://devroast:devroast_password@localhost:5432/devroast
```

## Configuração Drizzle

### drizzle.config.ts

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: {
    ".*": "snake_case",
  },
});
```

## Status de Implementação

### Fase 1: Setup Docker Compose
- [x] Criar arquivo `docker-compose.yml` na raiz do projeto
- [x] Configurar serviço PostgreSQL com Docker Compose
- [x] Criar arquivo `.env` com `DATABASE_URL`

### Fase 2: Configuração Drizzle
- [x] Instalar dependências: `drizzle-orm`, `drizzle-kit`, `pg`
- [x] Criar arquivo `drizzle.config.ts`
- [x] Criar pasta `src/db/` com:
  - `index.ts` - conexão com banco
  - `schema.ts` - definições de tabelas

### Fase 3: Migrações
- [ ] Executar `npm run db:generate` para gerar migrations
- [ ] Executar `npm run db:migrate` para aplicar migrations

### Fase 4: Operações CRUD
- [x] Criar arquivo `src/db/queries.ts` com:
  - `createSubmission(code, language)` - criar submissão
  - `createRoast(submissionId, feedback, score, roastMode)` - criar roast
  - `createIssue(roastId, severity, title, description)` - criar issue
  - `createDiff(roastId, diffType, content)` - criar diff
  - `getLeaderboard(limit)` - buscar top submissions por score
  - `getSubmissionById(id)` - buscar submissão por ID
  - `getFullRoastData(submissionId)` - buscar dados completos do roast

### Fase 5: Integração Frontend
- [ ] Criar API routes em `src/app/api/`:
  - `POST /api/submit` - submeter código
  - `GET /api/leaderboard` - buscar leaderboard
  - `GET /api/stats` - buscar estatísticas
- [ ] Atualizar componentes para usar dados do banco

## Scripts npm

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Como Rodar

```bash
# Iniciar banco de dados
docker-compose up -d

# Instalar dependências
npm install

# Gerar migrations
npm run db:generate

# Aplicar migrations
npm run db:migrate

# ou fazer push do schema (desenvolvimento)
npm run db:push
```

## Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts      # Conexão DB
│   ├── schema.ts     # Schema Drizzle
│   └── queries.ts    # Queries/CRUD
├── app/api/
│   ├── submit/
│   │   └── route.ts
│   ├── leaderboard/
│   │   └── route.ts
│   └── stats/
│       └── route.ts

drizzle.config.ts
docker-compose.yml
.env
```
