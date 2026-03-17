import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "../init";
import { getStats } from "@/db/queries";

export const appRouter = createTRPCRouter({
  stats: baseProcedure.query(async () => {
    const stats = await getStats();
    return {
      totalSubmissions: stats.totalSubmissions,
      avgScore: Number(stats.avgScore),
    };
  }),
});

export type AppRouter = typeof appRouter;
