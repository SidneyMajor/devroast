import {
  createSubmission,
  createRoast,
  createIssue,
  createDiff,
  getFullRoastData,
  updateStats,
} from "@/db/queries";

export type RoastIssue = {
  severity: "critical" | "warning" | "good" | "verdict";
  title: string;
  description: string;
};

export type RoastDiff = {
  diffType: "added" | "removed" | "context";
  content: string;
};

export type GeneratedRoast = {
  feedback: string;
  score: number;
  roastMode: boolean;
  issues: RoastIssue[];
  diffs: RoastDiff[];
};

const sampleIssues: RoastIssue[] = [
  {
    severity: "critical",
    title: "using var instead of const/let",
    description:
      "The var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior and bugs. Modern JavaScript uses const for immutable bindings and let for mutable ones.",
  },
  {
    severity: "warning",
    title: "unused variable detected",
    description: "The variable 'unused' is declared but never used in this scope.",
  },
  {
    severity: "good",
    title: "proper error handling",
    description:
      "This function properly handles errors and provides meaningful error messages.",
  },
];

const sampleDiffs: RoastDiff[] = [
  { diffType: "removed", content: "var total = 0;" },
  { diffType: "added", content: "const total = 0;" },
  { diffType: "context", content: "for (let i = 0; i < items.length; i++) {" },
  { diffType: "context", content: "  total += items[i].price;" },
  { diffType: "context", content: "}" },
];

function generateMockRoast(code: string, roastMode: boolean): GeneratedRoast {
  const hasVar = code.includes("var ");
  const hasLetConst = code.includes("let ") || code.includes("const ");

  const issues: RoastIssue[] = [];

  if (hasVar) {
    issues.push(sampleIssues[0]);
  }

  if (!hasLetConst && !hasVar) {
    issues.push({
      severity: "warning",
      title: "no variable declarations found",
      description: "Are you trying to break JavaScript?",
    });
  }

  const score = hasVar ? 1 + Math.random() * 3 : 5 + Math.random() * 4;

  const feedback = roastMode
    ? `Wow, ${hasVar ? "using var in ${new Date().getFullYear()}?" : "This code is... something else."} Don't quit your day job, but maybe consider reading a JavaScript book from this decade.`
    : `Thanks for submitting! Here's some feedback to help you improve.`;

  return {
    feedback,
    score: Math.round(score * 10) / 10,
    roastMode,
    issues: issues.length > 0 ? issues : [sampleIssues[2]],
    diffs: hasVar ? sampleDiffs : [],
  };
}

export async function submitCode(
  code: string,
  language: string,
  roastMode: boolean = true
) {
  const submission = await createSubmission(code, language);

  const generatedRoast = generateMockRoast(code, roastMode);

  const roast = await createRoast(
    submission.id,
    generatedRoast.feedback,
    generatedRoast.score,
    generatedRoast.roastMode
  );

  for (const issue of generatedRoast.issues) {
    await createIssue(roast.id, issue.severity, issue.title, issue.description);
  }

  for (const diff of generatedRoast.diffs) {
    await createDiff(roast.id, diff.diffType, diff.content);
  }

  await updateStats();

  const fullData = await getFullRoastData(submission.id);

  return fullData;
}
