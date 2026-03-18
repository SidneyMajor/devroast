# Padrões tRPC

## Visão Geral

Este documento define os padrões para implementação de tRPC no projeto DevRoast.

## Estrutura de Arquivos

```
src/trpc/
├── init.ts              # initTRPC, createTRPCContext, baseProcedure
├── query-client.ts      # makeQueryClient, getQueryClient
├── client.tsx           # TRPCProvider para Client Components
├── server.tsx           # Helpers para Server Components
├── react-provider.tsx   # Wrapper do Provider para layout
└── routers/
    └── _app.ts          # AppRouter com todas as procedures
```

## Estrutura do Router

```typescript
// src/trpc/routers/_app.ts
import { createTRPCRouter, baseProcedure } from "../init";

export const appRouter = createTRPCRouter({
  stats: baseProcedure.query(async () => {
    // implementação
  }),
});

export type AppRouter = typeof appRouter;
```

## Adicionando Novas Procedures

### Query

```typescript
export const appRouter = createTRPCRouter({
  nomeQuery: baseProcedure.query(async () => {
    return dados;
  }),
});
```

### Queries Paralelas com Promise.all

Quando múltiplas queries são independentes, usar `Promise.all` para executar em paralelo:

```typescript
export const appRouter = createTRPCRouter({
  homePageData: baseProcedure.query(async () => {
    const [statsData, leaderboardData] = await Promise.all([
      getStats(),
      getLeaderboard(3),
    ]);

    return {
      stats: {
        totalSubmissions: statsData.totalSubmissions,
        avgScore: Number(statsData.avgScore),
      },
      leaderboard: leaderboardData.rows.map((r) => ({
        id: r.id,
        code: r.code,
        language: r.language,
        score: Number(r.score),
      })),
    };
  }),
});
```

**Por que usar Promise.all?**
- Reduz tempo de resposta executando queries simultaneamente
- Queries independentes não dependem uma da outra para executar
- Melhor performance para páginas com múltiplos dados

### Mutation

```typescript
export const appRouter = createTRPCRouter({
  nomeMutation: baseProcedure
    .input(z.object({ param: z.string() }))
    .mutation(async ({ input }) => {
      return resultado;
    }),
});
```

## Uso em Client Components

```tsx
"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function StatsMetrics() {
  const { data } = trpc.stats.useQuery();

  const total = data?.totalSubmissions ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <div>
      <NumberFlow value={total} />
      <NumberFlow value={avgScore} />
    </div>
  );
}
```

## Provider

O `TRPCReactProvider` já está integrado no `layout.tsx`. Não é necessário adicionar manualmente.

## Checklist de Nova Feature tRPC

- [ ] Adicionar procedure no `src/trpc/routers/_app.ts`
- [ ] Criar/implementar query no componente que usa
- [ ] Testar endpoint `/api/trpc/<procedure>`
- [ ] Verificar tipos TypeScript
- [ ] Rodar `npm run build` para validar
