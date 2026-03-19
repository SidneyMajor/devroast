import { db } from "./index";
import { analysisItems, languages, roasts } from "./schema";
import { desc, eq, sql, asc } from "drizzle-orm";

export async function getStats() {
  const result = await db
    .select({
      totalSubmissions: sql<number>`COUNT(*)::int`,
      avgScore: sql<number>`COALESCE(AVG(${roasts.score})::numeric(4,2), 0)`,
    })
    .from(roasts);

  const row = result[0];
  return {
    totalSubmissions: row?.totalSubmissions ?? 0,
    avgScore: row?.avgScore ?? 0,
  };
}

export async function getLeaderboard(limit = 10) {
  const items = await db
    .select({
      id: roasts.id,
      code: roasts.code,
      language: roasts.language,
      score: roasts.score,
      roastMode: roasts.roastMode,
      verdict: roasts.verdict,
      lineCount: roasts.lineCount,
      createdAt: roasts.createdAt,
    })
    .from(roasts)
    .orderBy(roasts.score) // lowest score first (shame)
    .limit(limit);

  return items;
}

export async function getRoastDetails(roastId: string) {
  const [roast] = await db
    .select()
    .from(roasts)
    .where(eq(roasts.id, roastId));

  if (!roast) return null;

  const items = await db
    .select()
    .from(analysisItems)
    .where(sql`${analysisItems.roastId} = ${roastId}`)
    .orderBy(analysisItems.order, desc(analysisItems.severity));

  return { roast, analysisItems: items };
}

export async function getLanguages() {
  const items = await db
    .select({
      id: languages.id,
      label: languages.label,
    })
    .from(languages)
    .where(eq(languages.isActive, true))
    .orderBy(asc(languages.label));

  return items;
}
