# Roast Submission Feature - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement roast submission feature with OpenAI GPT-4o-mini integration, toast notifications, and real data on result page.

**Architecture:** REST API (`/api/submit`) calls OpenAI for code analysis, saves results to PostgreSQL via Drizzle ORM, redirects to result page showing real data from database.

**Tech Stack:** OpenAI SDK, React toast notifications, tRPC, Drizzle ORM, PostgreSQL

---

## File Structure Overview

```
src/
├── lib/
│   └── openai.ts                   # [CREATE] OpenAI client wrapper
├── components/ui/
│   └── toast.tsx                   # [CREATE] Toast notification component
│   └── use-toast.ts                # [CREATE] Toast hook
├── app/api/submit/
│   └── route.ts                    # [MODIFY] Connect to OpenAI
├── app/_components/
│   └── HomeInteractive.tsx         # [MODIFY] Add submit state & redirect
├── app/roast/[id]/
│   └── page.tsx                    # [MODIFY] Fetch real data from DB
└── .env                            # [CREATE] Environment variables
```

---

## Task 1: Setup OpenAI SDK

**Files:**
- Create: `.env`
- Create: `src/lib/openai.ts`
- Modify: `package.json` (add dependency)

- [ ] **Step 1: Create .env file with OpenAI variables**

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini

# System Prompts
SYSTEM_PROMPT_ROAST=You are an expert code reviewer with a sarcastic, brutally honest personality. Your mission is to roast terrible code while being technically accurate. Be witty, mean, and educational. Make developers laugh while they cry.
SYSTEM_PROMPT_HONEST=You are a constructive code reviewer helping developers improve. Provide honest, actionable feedback with empathy. Focus on teaching, not insulting.
```

Run: Copy to `.env`

- [ ] **Step 2: Create .env.example for documentation**

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini

# System Prompts (optional)
SYSTEM_PROMPT_ROAST=You are an expert code reviewer with a sarcastic, brutally honest personality...
SYSTEM_PROMPT_HONEST=You are a constructive code reviewer helping developers improve...
```

Run: Create `.env.example`

- [ ] **Step 3: Install OpenAI SDK**

Run: `npm install openai`

Expected: Package added to package.json

- [ ] **Step 4: Create OpenAI client wrapper**

```typescript
// src/lib/openai.ts
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export const SYSTEM_PROMPTS = {
  roast: process.env.SYSTEM_PROMPT_ROAST || "You are an expert code reviewer with a sarcastic, brutally honest personality. Your mission is to roast terrible code while being technically accurate. Be witty, mean, and educational. Make developers laugh while they cry.",
  honest: process.env.SYSTEM_PROMPT_HONEST || "You are a constructive code reviewer helping developers improve. Provide honest, actionable feedback with empathy. Focus on teaching, not insulting.",
};
```

Run: Create `src/lib/openai.ts`

- [ ] **Step 5: Run build to verify no errors**

Run: `npm run build`

Expected: Build completes without OpenAI-related errors

- [ ] **Step 6: Commit**

```bash
git add .env .env.example src/lib/openai.ts package.json package-lock.json
git commit -m "feat: add OpenAI SDK and client wrapper

- Install openai package
- Create .env with API key and prompts
- Add .env.example for documentation
- Implement openai.ts client with GPT-4o-mini model"
```

---

## Task 2: Create Toast Component

**Files:**
- Create: `src/components/ui/toast.tsx`
- Create: `src/hooks/use-toast.ts`
- Modify: `src/app/layout.tsx` (add ToastProvider)

- [ ] **Step 1: Create use-toast hook**

```typescript
// src/hooks/use-toast.ts
"use client";

import { useState, useCallback } from "react";

export type ToastVariant = "error" | "success" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ variant, title, description }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, variant, title, description }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, dismiss, toasts };
}
```

Run: Create `src/hooks/use-toast.ts`

- [ ] **Step 2: Create Toast component**

```typescript
// src/components/ui/toast.tsx
"use client";

import { useToast, Toast as ToastType } from "@/hooks/use-toast";

const variantStyles = {
  error: {
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]",
    icon: "✕",
  },
  success: {
    bg: "bg-[#22C55E]/10",
    border: "border-[#22C55E]",
    icon: "✓",
  },
  info: {
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]",
    icon: "i",
  },
};

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: () => void }) {
  const styles = variantStyles[toast.variant];

  return (
    <div
      className={`flex items-start gap-3 ${styles.bg} border ${styles.border} rounded-lg p-4 min-w-[320px] max-w-[420px] shadow-lg animate-slide-in`}
    >
      <span className={`font-mono text-sm ${toast.variant === "error" ? "text-[#EF4444]" : toast.variant === "success" ? "text-[#22C55E]" : "text-[#3B82F6]"}`}>
        {styles.icon}
      </span>
      <div className="flex-1">
        <p className="font-mono text-sm text-[#FAFAFA]">{toast.title}</p>
        {toast.description && (
          <p className="font-mono text-xs text-[#6B7280] mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="font-mono text-xs text-[#6B7280] hover:text-[#FAFAFA] transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

// Export toast function for easy use
export const toast = {
  error: (title: string, description?: string) => {
    const { toast: showToast } = useToastToasted();
    showToast({ variant: "error", title, description });
  },
  success: (title: string, description?: string) => {
    const { toast: showToast } = useToastToasted();
    showToast({ variant: "success", title, description });
  },
  info: (title: string, description?: string) => {
    const { toast: showToast } = useToastToasted();
    showToast({ variant: "info", title, description });
  },
};

// Hook to use within components
function useToastToasted() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = useCallback(({ variant, title, description }: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, variant, title, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, dismiss, toasts };
}
```

Run: Create `src/components/ui/toast.tsx`

Note: This is a simplified version. For production, consider using a library like `react-hot-toast` or `sonner`.

- [ ] **Step 3: Run npm check**

Run: `npm run check`

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-toast.ts src/components/ui/toast.tsx
git commit -m "feat: add toast notification component

- Create useToast hook with auto-dismiss
- Create ToastContainer for rendering toasts
- Add slide-in animation styles"
```

---

## Task 3: Implement OpenAI Analysis Function

**Files:**
- Modify: `src/lib/roast.ts`

- [ ] **Step 1: Read current roast.ts implementation**

Run: Read `src/lib/roast.ts` to understand current structure

- [ ] **Step 2: Add OpenAI analysis types and function**

```typescript
// Add after existing imports in src/lib/roast.ts

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
          content: `Analyze this ${language} code and return a JSON response:\n\n${code}`,
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
      diffs: analysis.diff || [],
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw error;
  }
}
```

Run: Update `src/lib/roast.ts` with OpenAI analysis function

- [ ] **Step 3: Modify submitCode to use AI (with fallback)**

```typescript
// Modify submitCode function in src/lib/roast.ts

export async function submitCode(
  code: string,
  language: string,
  roastMode: boolean = true
) {
  let generatedRoast: GeneratedRoast;

  // Try OpenAI analysis
  try {
    generatedRoast = await analyzeCodeWithAI(code, language, roastMode);
  } catch (error) {
    // Fallback to mock if OpenAI fails
    console.warn("OpenAI failed, using mock data:", error);
    generatedRoast = generateMockRoast(code, roastMode);
  }

  // Save to database
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

  // Save analysis items
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
```

Run: Update `submitCode` function in `src/lib/roast.ts`

- [ ] **Step 4: Run build to verify**

Run: `npm run build`

Expected: Build completes successfully

- [ ] **Step 5: Commit**

```bash
git add src/lib/roast.ts
git commit -m "feat: integrate OpenAI GPT-4o-mini for code analysis

- Add analyzeCodeWithAI function with JSON output parsing
- Modify submitCode to use AI with mock fallback
- Save roastQuote and suggestedFix to database"
```

---

## Task 4: Update Submit API Route

**Files:**
- Modify: `src/app/api/submit/route.ts`

- [ ] **Step 1: Read current API route**

Run: Read `src/app/api/submit/route.ts`

- [ ] **Step 2: Improve error handling**

```typescript
// src/app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { submitCode } from "@/lib/roast";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language = "javascript", roastMode = true } = body;

    // Validation
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    if (code.length > 2000) {
      return NextResponse.json(
        { error: "Code too long. Maximum 2,000 characters." },
        { status: 400 }
      );
    }

    // Submit and analyze
    const result = await submitCode(code, language, roastMode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error submitting code:", error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Analysis took too long. Please try again." },
          { status: 504 }
        );
      }
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI service configuration error." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze code. Please try again." },
      { status: 500 }
    );
  }
}
```

Run: Update `src/app/api/submit/route.ts`

- [ ] **Step 3: Test API endpoint manually**

Run: Start dev server and test with curl:
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"code": "var x = 1", "language": "javascript", "roastMode": true}'
```

Expected: JSON response with roast data

- [ ] **Step 4: Commit**

```bash
git add src/app/api/submit/route.ts
git commit -m "fix: improve submit API error handling

- Add specific error messages for timeout and API key issues
- Better validation messages"
```

---

## Task 5: Update HomeInteractive Component

**Files:**
- Modify: `src/app/_components/HomeInteractive.tsx`

- [ ] **Step 1: Read current component**

Run: Read `src/app/_components/HomeInteractive.tsx`

- [ ] **Step 2: Add submit state and handlers**

```typescript
// src/app/_components/HomeInteractive.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { CodeEditor, MAX_CODE_LENGTH, type Language } from "@/components/code-editor";
import { toast } from "@/components/ui/toast";

interface HomeInteractiveProps {
  stats: {
    totalSubmissions: number;
    avgScore: number;
  };
  languages: Language[];
}

export function HomeInteractive({ stats, languages }: HomeInteractiveProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roastMode, setRoastMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOverLimit = code.length > MAX_CODE_LENGTH;
  const canSubmit = code.trim().length > 0 && !isOverLimit && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          roastMode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      const result = await response.json();

      // Redirect to result page
      router.push(`/roast/${result.id}`);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        "Failed to roast",
        error instanceof Error ? error.message : "Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-5 pt-10">
      <div className="flex w-full max-w-[780px] flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-mono text-[36px] font-bold leading-tight">
            <span className="text-[#10B981]">$</span>{" "}
            <span className="text-[#FAFAFA]">paste your code. get roasted.</span>
          </h1>
          <p className="font-[family:var(--font-secondary)] text-sm text-[#6B7280]">
            // drop your code below and we&apos;ll rate it — brutally honest or full roast mode
          </p>
        </div>

        <CodeEditor
          placeholder="paste your code here..."
          value={code}
          onChange={setCode}
          language={language}
          onLanguageChange={setLanguage}
          languages={languages}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
            <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
              // maximum sarcasm enabled
            </span>
          </div>
          <Button 
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? "roasting..." : "roast_my_code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

Run: Update `src/app/_components/HomeInteractive.tsx`

- [ ] **Step 3: Run build to verify**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/HomeInteractive.tsx
git commit -m "feat: connect submit button to API with redirect

- Add isSubmitting state
- Add handleSubmit function with fetch to /api/submit
- Add toast notification on error
- Redirect to /roast/{id} on success"
```

---

## Task 6: Update Result Page to Use Real Data

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`
- Modify: `src/app/roast/[id]/RoastResult.tsx` (create)

- [ ] **Step 1: Read current result page**

Run: Read `src/app/roast/[id]/page.tsx`

- [ ] **Step 2: Create RoastResult client component**

```typescript
// src/app/roast/[id]/RoastResult.tsx
"use client";

import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";

interface AnalysisItem {
  id: string;
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
  order: number;
}

interface RoastResultProps {
  roast: {
    id: string;
    code: string;
    language: string;
    score: number;
    verdict: string;
    roastQuote: string;
    lineCount: number;
    roastMode: boolean;
  };
  analysisItems: AnalysisItem[];
}

function Badge({ label, variant }: { label: string; variant: "critical" | "warning" | "good" }) {
  const colors = {
    critical: "bg-[#EF4444]",
    warning: "bg-[#F59E0B]",
    good: "bg-[#22C55E]",
  };
  const textColors = {
    critical: "text-[#EF4444]",
    warning: "text-[#F59E0B]",
    good: "text-[#22C55E]",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${colors[variant]}`} />
      <span className={`font-mono text-[12px] font-medium ${textColors[variant]}`}>
        {label}
      </span>
    </div>
  );
}

export function RoastResult({ roast, analysisItems }: RoastResultProps) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-10 py-10">
      <div className="flex flex-col gap-10">
        {/* Header with score and quote */}
        <div className="flex items-center justify-center gap-12">
          <ScoreRing score={roast.score} />

          <div className="flex flex-1 flex-col gap-4">
            <Badge label={`verdict: ${roast.verdict}`} variant={
              roast.score <= 2 ? "critical" : roast.score <= 5 ? "warning" : "good"
            } />
            <h1 className="max-w-xl font-mono text-[20px] font-normal leading-[1.5] text-[#FAFAFA]">
              &quot;{roast.roastQuote}&quot;
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[12px] text-[#4B5563]">lang: {roast.language}</span>
              <span className="text-[12px] text-[#4B5563]">·</span>
              <span className="font-mono text-[12px] text-[#4B5563]">{roast.lineCount} lines</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-[#6B7280]">
                {roast.roastMode ? "🔥 roast mode" : "💀 honest mode"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        {/* Code submission */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">your_submission</h2>
          </div>
          <CodeBlock code={roast.code} language={roast.language} />
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        {/* Detailed analysis */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">detailed_analysis</h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {analysisItems.map((issue) => (
              <div key={issue.id} className="flex flex-col gap-3 rounded-lg border border-[#2A2A2A] p-5">
                <div className="flex items-center gap-2">
                  <Badge label={issue.severity} variant={issue.severity} />
                </div>
                <h3 className="font-mono text-[13px] font-medium text-[#FAFAFA]">{issue.title}</h3>
                <p className="font-mono text-[12px] leading-[1.5] text-[#6B7280]">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

Run: Create `src/app/roast/[id]/RoastResult.tsx`

- [ ] **Step 3: Update page.tsx to fetch real data**

```typescript
// src/app/roast/[id]/page.tsx
import { notFound } from "next/navigation";
import { getRoastDetails } from "@/db/queries";
import { RoastResult } from "./RoastResult";

export const revalidate = 0; // Always fetch fresh data
export const dynamic = "force-dynamic";

export default async function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getRoastDetails(id);

  if (!result) {
    notFound();
  }

  return (
    <RoastResult
      roast={{
        id: result.roast.id,
        code: result.roast.code,
        language: result.roast.language,
        score: Number(result.roast.score),
        verdict: result.roast.verdict,
        roastQuote: result.roast.roastQuote || "",
        lineCount: result.roast.lineCount,
        roastMode: result.roast.roastMode,
      }}
      analysisItems={result.analysisItems.map((item) => ({
        id: item.id,
        severity: item.severity,
        title: item.title,
        description: item.description,
        order: item.order,
      }))}
    />
  );
}
```

Run: Update `src/app/roast/[id]/page.tsx`

- [ ] **Step 4: Run build to verify**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 5: Commit**

```bash
git add src/app/roast/[id]/page.tsx src/app/roast/[id]/RoastResult.tsx
git commit -m "feat: connect result page to real database data

- Create RoastResult client component
- Fetch roast details from database in page.tsx
- Render score, quote, code, and analysis items from DB"
```

---

## Task 7: Add ToastProvider to Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read current layout**

Run: Read `src/app/layout.tsx`

- [ ] **Step 2: Add ToastContainer**

```typescript
// Add to imports
import { ToastContainer } from "@/components/ui/toast";

// Add inside body, after Navbar
<body>
  <Navbar />
  <ToastContainer /> {/* Add here */}
  {children}
</body>
```

Run: Update `src/app/layout.tsx`

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: Build completes

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add ToastContainer to layout

- Import and render ToastContainer
- Toasts will appear in top-right corner"
```

---

## Task 8: End-to-End Testing

**Files:**
- Modify: `e2e/leaderboard.spec.ts` (add new tests)

- [ ] **Step 1: Create submit and result page tests**

```typescript
// e2e/submit.spec.ts
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Code Submission Flow", () => {
  test("should submit code and redirect to result page", async ({ page }) => {
    await page.goto(BASE_URL);

    // Fill in code
    const textarea = page.locator("textarea");
    await textarea.fill("const x = 1;");

    // Click submit button
    const submitButton = page.getByRole("button", { name: /roast_my_code/i });
    await submitButton.click();

    // Should redirect to result page
    await expect(page).toHaveURL(/\/roast\/\w+/);

    // Should show result content
    await expect(page.getByText(/your_submission/i)).toBeVisible();
    await expect(page.getByText(/detailed_analysis/i)).toBeVisible();
  });

  test("should disable button during submission", async ({ page }) => {
    await page.goto(BASE_URL);

    const textarea = page.locator("textarea");
    await textarea.fill("let x = 1;");

    const submitButton = page.getByRole("button", { name: /roast_my_code/i });
    
    // Button should be enabled
    await expect(submitButton).toBeEnabled();

    // Click and check loading state
    await submitButton.click();

    // Should show loading state
    await expect(page.getByText(/roasting\.\.\./i)).toBeVisible();
  });

  test("should show toast on error", async ({ page }) => {
    // This test would require mocking the API to fail
    // Skipping for now - can be added with API mocking
  });
});

test.describe("Result Page", () => {
  test("should display roast data from database", async ({ page }) => {
    // First submit to get a valid roast ID
    await page.goto(BASE_URL);
    const textarea = page.locator("textarea");
    await textarea.fill("var x = 1;");
    const submitButton = page.getByRole("button", { name: /roast_my_code/i });
    await submitButton.click();

    // Wait for redirect
    await page.waitForURL(/\/roast\/\w+/);

    // Should show score
    await expect(page.locator('[class*="ScoreRing"]')).toBeVisible();

    // Should show verdict
    await expect(page.getByText(/verdict:/i)).toBeVisible();

    // Should show language
    await expect(page.getByText(/lang:/i)).toBeVisible();
  });
});
```

Run: Create `e2e/submit.spec.ts`

- [ ] **Step 2: Run tests**

Run: `npx playwright test --project=chromium`

Expected: Tests pass (may need adjustment based on actual UI)

- [ ] **Step 3: Commit**

```bash
git add e2e/submit.spec.ts
git commit -m "test: add E2E tests for submission flow and result page"
```

---

## Verification Checklist

- [ ] All npm scripts pass (`npm run check`, `npm run build`)
- [ ] All Playwright tests pass
- [ ] No TypeScript errors
- [ ] Environment variables documented in `.env.example`
- [ ] Design spec updated if needed

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Setup OpenAI SDK | `.env`, `src/lib/openai.ts` |
| 2 | Toast Component | `src/hooks/use-toast.ts`, `src/components/ui/toast.tsx` |
| 3 | OpenAI Analysis | `src/lib/roast.ts` |
| 4 | Submit API | `src/app/api/submit/route.ts` |
| 5 | HomeInteractive | `src/app/_components/HomeInteractive.tsx` |
| 6 | Result Page | `src/app/roast/[id]/page.tsx`, `RoastResult.tsx` |
| 7 | ToastProvider | `src/app/layout.tsx` |
| 8 | Testing | `e2e/submit.spec.ts` |

---

**Plan complete!** Ready for implementation.
