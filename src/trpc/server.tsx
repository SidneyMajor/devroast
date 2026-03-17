import "server-only";

import { createTRPCReact } from "@trpc/react-query";
import { headers } from "next/headers";
import { cache } from "react";

import { getQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
import { createTRPCContext } from "./init";
import type { AppRouter } from "./routers/_app";

export const trpc = createTRPCReact<AppRouter>();

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext();
});

export const getServerClient = cache(async () => {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
});

export async function prefetch<TQueryOptions>(queryOptions: TQueryOptions) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(queryOptions as any);
  return queryOptions;
}

export function HydrateClient({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}
