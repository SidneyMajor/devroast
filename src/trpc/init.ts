import { initTRPC } from "@trpc/server";
import { cache } from "react";
import "server-only";

export const createTRPCContext = cache(async () => {
  return {};
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
