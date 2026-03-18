# DevRoast - Padrões do Projeto

## Visão Geral

Aplicação web para submissão de código e feedback automático com humor.

## Estrutura

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Homepage
│   ├── layout.tsx    # Layout raiz + Navbar
│   └── components/   # Página de componentes
├── components/
│   └── ui/           # Componentes de UI
└── trpc/             # tRPC server e client
```

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run check   # Lint + format
```

## Stack

- **Framework**: Next.js 16 (App Router)
- **API**: tRPC + TanStack React Query v5
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Animations**: NumberFlow

## Regras Gerais

### 1. Commits

- Commits pequenos e focados
- Usar Conventional Commits: `feat:`, `fix:`, `refactor:`, etc.
- Commitar apenas arquivos relacionados à feature/fix

### 2. Commits Parciais

Commitar apenas arquivos relacionados ao trabalho atual:

```bash
git add src/trpc/ src/components/ui/stats-metrics.tsx
git commit -m "feat: add tRPC integration"
```

### 3. Build e Lint

Sempre rodar antes de commitar:

```bash
npm run check    # biome lint + format
npm run build    # verificar build
```

### 4. Dependências

Novas dependências devem ser justificadas e discutidas antes de adicionar.
