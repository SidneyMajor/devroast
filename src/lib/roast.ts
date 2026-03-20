import { db } from "@/db";
import { roasts, analysisItems } from "@/db/schema";
import { getRoastDetails } from "@/db/queries";
import { getLLMClient, getModel, SYSTEM_PROMPTS } from "./llm";

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

const VALID_SEVERITIES = ["critical", "warning", "good"] as const;
type ValidSeverity = typeof VALID_SEVERITIES[number];

function normalizeSeverity(severity: unknown): ValidSeverity {
  if (typeof severity === "string" && VALID_SEVERITIES.includes(severity as ValidSeverity)) {
    return severity as ValidSeverity;
  }
  return "warning";
}

function parseDiffFromResponse(diff: unknown): RoastDiff[] {
  if (!diff) return [];
  
  if (Array.isArray(diff)) {
    return diff
      .filter((d: any) => d && d.type && d.content)
      .map((d: { type: string; content: string }) => ({
        diffType: d.type as "added" | "removed" | "context",
        content: d.content,
      }));
  }
  
  if (typeof diff === "string") {
    const lines = diff.split("\n");
    return lines
      .filter((line) => line.startsWith("+") || line.startsWith("-") || line.startsWith(" "))
      .map((line) => {
        const content = line.slice(1).trimEnd();
        if (line.startsWith("+")) {
          return { diffType: "added" as const, content };
        }
        if (line.startsWith("-")) {
          return { diffType: "removed" as const, content };
        }
        return { diffType: "context" as const, content };
      });
  }
  
  return [];
}

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
    const client = await getLLMClient();
    const model = await getModel();
    
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analyze this ${language} code and return ONLY valid JSON:

${code}

Return this exact JSON structure:
{"feedback":"...","score":5,"issues":[{"severity":"warning","title":"...","description":"..."}],"diff":[{"type":"removed","content":"..."},{"type":"added","content":"..."}]}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from LLM");
    }

    let analysis: any;
    try {
      analysis = JSON.parse(content);
    } catch (e) {
      // Try to salvage JSON from extra text / code fences
      try {
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          analysis = JSON.parse(content.slice(start, end + 1));
        } else {
          throw e;
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", content);
        throw new Error("Failed to parse LLM response as JSON");
      }
    }

    const diffs = parseDiffFromResponse(analysis.diff);
    
    return {
      feedback: analysis.feedback || "Analysis complete.",
      score: Math.min(10, Math.max(0, analysis.score || 5)),
      roastMode,
      issues: Array.isArray(analysis.issues) 
        ? analysis.issues.map((issue: any) => ({
            ...issue,
            severity: normalizeSeverity(issue.severity),
          }))
        : [],
      diffs,
    };
  } catch (error) {
    console.error("LLM analysis error:", error);
    throw error;
  }
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
  const generatedRoast = await analyzeCodeWithAI(code, language, roastMode);

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
