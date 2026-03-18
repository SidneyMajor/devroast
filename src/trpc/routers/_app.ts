import { createTRPCRouter, baseProcedure } from "../init";
import { getStats, getLeaderboard } from "@/db/queries";

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
});

export type AppRouter = typeof appRouter;
