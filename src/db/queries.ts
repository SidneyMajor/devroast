import { db } from "./index";
import { submissions, roasts, issues, diffs, stats } from "./schema";
import { eq } from "drizzle-orm";

export async function createSubmission(code: string, language: string) {
  const [submission] = await db
    .insert(submissions)
    .values({ code, language })
    .returning();
  return submission;
}

export async function createRoast(
  submissionId: string,
  feedback: string,
  score: number,
  roastMode: boolean
) {
  const [roast] = await db
    .insert(roasts)
    .values({ submissionId, feedback, score: String(score), roastMode })
    .returning();
  return roast;
}

export async function createIssue(
  roastId: string,
  severity: "critical" | "warning" | "good" | "verdict",
  title: string,
  description: string
) {
  const [issue] = await db
    .insert(issues)
    .values({ roastId, severity, title, description })
    .returning();
  return issue;
}

export async function createDiff(
  roastId: string,
  diffType: "added" | "removed" | "context",
  content: string
) {
  const [diff] = await db
    .insert(diffs)
    .values({ roastId, diffType, content })
    .returning();
  return diff;
}

export async function getSubmissionById(id: string) {
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id));
  return submission;
}

export async function getRoastBySubmissionId(submissionId: string) {
  const [roast] = await db
    .select()
    .from(roasts)
    .where(eq(roasts.submissionId, submissionId));
  return roast;
}

export async function getIssuesByRoastId(roastId: string) {
  return db.select().from(issues).where(eq(issues.roastId, roastId));
}

export async function getDiffsByRoastId(roastId: string) {
  return db.select().from(diffs).where(eq(diffs.roastId, roastId));
}

export async function getLeaderboard(limit = 10) {
  return db.execute(`
    SELECT 
      s.id,
      s.code,
      s.language,
      s.created_at as "createdAt",
      r.score,
      r.roast_mode as "roastMode",
      r.feedback
    FROM submissions s
    INNER JOIN roasts r ON r.submission_id = s.id
    ORDER BY r.score ASC
    LIMIT ${limit}
  `);
}

export async function getStats() {
  const result = await db.execute(`
    SELECT 
      COUNT(*)::integer as "totalSubmissions",
      COALESCE(AVG(r.score)::numeric(3,2), 0) as "avgScore"
    FROM submissions s
    INNER JOIN roasts r ON r.submission_id = s.id
  `);
  const row = result.rows[0];
  if (!row) {
    return { totalSubmissions: 0, avgScore: "0" };
  }
  return row as { totalSubmissions: number; avgScore: string };
}

export async function updateStats() {
  const statsData = await getStats();
  const existingStats = await db.select().from(stats).limit(1);
  
  if (existingStats.length > 0) {
    const [stat] = await db
      .update(stats)
      .set({
        totalSubmissions: String(statsData.totalSubmissions),
        avgScore: String(statsData.avgScore),
        updatedAt: new Date(),
      })
      .where(eq(stats.id, existingStats[0].id))
      .returning();
    return stat;
  } else {
    const [stat] = await db
      .insert(stats)
      .values({
        totalSubmissions: String(statsData.totalSubmissions),
        avgScore: String(statsData.avgScore),
      })
      .returning();
    return stat;
  }
}

export async function getFullRoastData(submissionId: string) {
  const submission = await getSubmissionById(submissionId);
  if (!submission) return null;

  const roast = await getRoastBySubmissionId(submissionId);
  if (!roast) return null;

  const roastIssues = await getIssuesByRoastId(roast.id);
  const roastDiffs = await getDiffsByRoastId(roast.id);

  return {
    submission,
    roast,
    issues: roastIssues,
    diffs: roastDiffs,
  };
}
