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

export interface RoastListItem {
  id: string;
  code: string;
  language: string;
  score: number;
  verdict: string;
  roastQuote: string | null;
  lineCount: number;
  createdAt: Date;
}

export interface RoastsPaginatedResult {
  items: RoastListItem[];
  nextCursor: string | null;
}

export async function getRoastsPaginated(cursor: string | null, limit: number): Promise<RoastsPaginatedResult> {
  let cursorDate: Date | null = null;

  if (cursor) {
    const cursorRow = await db
      .select({ createdAt: roasts.createdAt })
      .from(roasts)
      .where(eq(roasts.id, cursor))
      .limit(1);

    cursorDate = cursorRow[0]?.createdAt ?? null;
  }

  const cursorCondition = cursorDate
    ? sql`(
        ${roasts.createdAt} < ${cursorDate}
        OR (${roasts.createdAt} = ${cursorDate} AND ${roasts.id} < ${cursor})
      )`
    : undefined;

  const items = await db
    .select({
      id: roasts.id,
      code: roasts.code,
      language: roasts.language,
      score: roasts.score,
      verdict: roasts.verdict,
      roastQuote: roasts.roastQuote,
      lineCount: roasts.lineCount,
      createdAt: roasts.createdAt,
    })
    .from(roasts)
    .where(cursorCondition ? sql`${cursorCondition}` : undefined)
    .orderBy(desc(roasts.createdAt), desc(roasts.id))
    .limit(limit + 1);

  const hasMore = items.length > limit;
  const resultItems = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? resultItems[resultItems.length - 1]?.id ?? null : null;

  return {
    items: resultItems.map((r) => ({
      id: r.id,
      code: r.code,
      language: r.language,
      score: Number(r.score),
      verdict: r.verdict,
      roastQuote: r.roastQuote,
      lineCount: r.lineCount,
      createdAt: r.createdAt,
    })),
    nextCursor,
  };
}
