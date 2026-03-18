# Padrões Next.js App Router

## Visão Geral

Este documento define os padrões para implementação de páginas e componentes no App Router.

## Loading States

### Métricas com NumberFlow

Para componentes que exibem números que animam do zero:

```tsx
// ✅ Usar valor inicial 0, sem skeleton/suspense
// O NumberFlow anima do 0 até o valor real
const { data } = trpc.stats.useQuery();
const total = data?.totalSubmissions ?? 0;

<NumberFlow value={total} />
```

### Por que não Skeleton/Suspense aqui?

- NumberFlow já oferece animação visual durante carregamento
- Skeleton + Suspense adicionaria complexidade desnecessária
- A animação de 0→valor real já comunica "carregando"

## Server vs Client Components

### Server Components (default)
- Páginas (`page.tsx`)
- Layouts (`layout.tsx`)
- Componentes que não precisam de estado/interação

### Client Components
- Adicionar `"use client"` no topo
- Usar hooks (useState, useEffect, etc.)
- Usar tRPC queries/mutations
- Usar NumberFlow

## Padrão de Composição

Componentes devem usar composição quando possível:

```tsx
// ✅ Correto
<CardRoot>
  <CardBadge variant="critical">critical</CardBadge>
  <CardTitle>Título</CardTitle>
</CardRoot>

// ❌ Evitar props spread
<Card title="..." description="..." />
```

## Estrutura de Página

```
src/app/
├── page.tsx          # Homepage (Server Component)
├── layout.tsx       # Layout raiz
├── leaderboard/
│   └── page.tsx     # Página leaderboard
└── roast/
    └── [id]/
        └── page.tsx # Página de resultado
```
