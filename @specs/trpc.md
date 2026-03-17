# Nome: Integração tRPC com Next.js App Router

## Problema
Precisa de uma camada de API type-safe entre front-end e back-end no Next.js.

## Solução
Integrar tRPC usando TanStack React Query v5 com Next.js App Router, suportando Server Components (SSR) e Client Components.

## Critérios

- [ ] Instalar dependências: @trpc/server, @trpc/client, @trpc/tanstack-react-query, @tanstack/react-query, zod, server-only
- [ ] Criar `trpc/init.ts`: initTRPC, createTRPCContext, createTRPCRouter, baseProcedure
- [ ] Criar `trpc/routers/_app.ts`: AppRouter com exemplo de procedure
- [ ] Criar `app/api/trpc/[trpc]/route.ts`: handler fetch para GET/POST
- [ ] Criar `trpc/query-client.ts`: makeQueryClient com dehydrate/hydrate config
- [ ] Criar `trpc/client.tsx`: TRPCProvider para Client Components
- [ ] Criar `trpc/server.tsx`: trpc proxy + getQueryClient + HydrateClient para Server Components
- [ ] Integrar TRPCReactProvider no layout raiz
- [ ] Demonstrar uso em Server Component com prefetch + HydrateClient
- [ ] Demonstrar uso em Client Component com useTRPC + useQuery

## Estrutura de Arquivos

```
src/
├── app/
│   └── api/trpc/[trpc]/route.ts   # API handler
├── trpc/
│   ├── init.ts                    # tRPC initialization
│   ├── query-client.ts            # React Query client
│   ├── client.tsx                 # Client-side provider
│   ├── server.tsx                 # Server-side utilities
│   └── routers/
│       └── _app.ts                # AppRouter
```

## Uso

**Server Component (prefetch):**
```tsx
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

export default async function Page() {
  prefetch(trpc.example.queryOptions());
  return <HydrateClient><ClientComponent /></HydrateClient>;
}
```

**Client Component:**
```tsx
'use client';
import { useTRPC } from '@/trpc/client';

export function ClientComponent() {
  const trpc = useTRPC();
  const query = useQuery(trpc.example.queryOptions());
}
```