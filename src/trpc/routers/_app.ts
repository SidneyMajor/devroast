import { createTRPCRouter, baseProcedure } from "../init";
import { getLanguages, getStats, getLeaderboard, getRoastsPaginated } from "@/db/queries";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  stats: baseProcedure.query(async () => {
    const stats = await getStats();
    return {
      totalSubmissions: stats.totalSubmissions,
      avgScore: Number(stats.avgScore),
    };
  }),

  leaderboardPreview: baseProcedure.query(async () => {
    const data = await getLeaderboard(3);
    return {
      items: data.map((r) => ({
        id: r.id,
        code: r.code,
        language: r.language,
        score: Number(r.score),
        roastMode: r.roastMode,
        lineCount: r.lineCount,
      })),
    };
  }),

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
      leaderboard: leaderboardData.map((r) => ({
        id: r.id,
        code: r.code,
        language: r.language,
        score: Number(r.score),
        roastMode: r.roastMode,
        lineCount: r.lineCount,
        verdict: r.verdict,
      })),
    };
  }),

  leaderboardFull: baseProcedure.query(async () => {
    const data = await getLeaderboard(20);
    return {
      items: data.map((r) => ({
        id: r.id,
        code: r.code,
        language: r.language,
        score: Number(r.score),
        roastMode: r.roastMode,
        lineCount: r.lineCount,
        verdict: r.verdict,
      })),
    };
  }),

  languagesList: baseProcedure.query(async () => {
    return getLanguages();
  }),

  roastsList: baseProcedure
    .input(z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(50).default(15),
    }))
    .query(async ({ input }) => {
      const result = await getRoastsPaginated(input.cursor ?? null, input.limit);
      return {
        items: result.items.map((r) => ({
          id: r.id,
          code: r.code,
          language: r.language,
          score: r.score,
          verdict: r.verdict,
          roastQuote: r.roastQuote,
          lineCount: r.lineCount,
          createdAt: r.createdAt.toISOString(),
        })),
        nextCursor: result.nextCursor,
      };
    }),
});

export type AppRouter = typeof appRouter;
