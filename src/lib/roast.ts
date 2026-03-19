import { db } from "@/db";
import { roasts, analysisItems } from "@/db/schema";
import { getRoastDetails } from "@/db/queries";
import { openai, OPENAI_MODEL, SYSTEM_PROMPTS } from "./openai";

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

interface OpenAIAnalysisResponse {
  feedback: string;
  score: number;
  issues: Array<{
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }>;
  diff: Array<{
    type: "removed" | "added" | "context";
    content: string;
  }>;
}

export async function analyzeCodeWithAI(
  code: string,
  language: string,
  roastMode: boolean
): Promise<GeneratedRoast> {
  const systemPrompt = roastMode
    ? SYSTEM_PROMPTS.roast
    : SYSTEM_PROMPTS.honest;

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analyze this ${language} code and return a JSON response with this exact structure:
{
  "feedback": "a short witty or constructive comment about the code",
  "score": a number from 0-10 where 0 is terrible and 10 is perfect,
  "issues": [
    {
      "severity": "critical" or "warning" or "good",
      "title": "short issue title",
      "description": "detailed explanation of the issue"
    }
  ],
  "diff": [
    {
      "type": "removed" or "added" or "context",
      "content": "line of code"
    }
  ]
}

Code to analyze:
${code}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const analysis: OpenAIAnalysisResponse = JSON.parse(content);

    return {
      feedback: analysis.feedback || "Analysis complete.",
      score: Math.min(10, Math.max(0, analysis.score || 5)),
      roastMode,
      issues: analysis.issues || [],
      diffs: (analysis.diff || []).map((d) => ({
        diffType: d.type,
        content: d.content,
      })),
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw error;
  }
}

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

function calculateVerdict(score: number): "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional" {
  if (score <= 2) return "needs_serious_help";
  if (score <= 4) return "rough_around_edges";
  if (score <= 6) return "decent_code";
  if (score <= 8) return "solid_work";
  return "exceptional";
}

export async function submitCode(
  code: string,
  language: string,
  roastMode: boolean = true
) {
  let generatedRoast: GeneratedRoast;

  try {
    generatedRoast = await analyzeCodeWithAI(code, language, roastMode);
  } catch (error) {
    console.warn("OpenAI analysis failed, using mock data:", error);
    generatedRoast = generateMockRoast(code, roastMode);
  }

  const [roast] = await db.insert(roasts).values({
    code,
    language,
    lineCount: code.split("\n").length,
    roastMode,
    score: generatedRoast.score,
    verdict: calculateVerdict(generatedRoast.score),
    roastQuote: generatedRoast.feedback,
    suggestedFix: generatedRoast.diffs
      .map((d) => `${d.diffType === "removed" ? "-" : d.diffType === "added" ? "+" : " "} ${d.content}`)
      .join("\n"),
  }).returning();

  for (let i = 0; i < generatedRoast.issues.length; i++) {
    const issue = generatedRoast.issues[i];
    await db.insert(analysisItems).values({
      roastId: roast.id,
      severity: issue.severity === "verdict" ? "warning" : issue.severity as "critical" | "warning" | "good",
      title: issue.title,
      description: issue.description,
      order: i,
    });
  }

  return getRoastDetails(roast.id);
}
