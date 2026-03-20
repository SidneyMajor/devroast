"use client";

import Link from "next/link";
import { ScoreRing } from "@/components/ui/score-ring";
import { CardRoot, CardBadge } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { twMerge } from "tailwind-merge";

interface RoastCardProps {
  id: string;
  code: string;
  language: string;
  score: number;
  verdict: string;
  roastQuote: string | null;
  lineCount: number;
  createdAt: string;
}

function getVerdictColor(verdict: string): { bg: string; text: string } {
  switch (verdict) {
    case "needs_serious_help":
      return { bg: "bg-[#EF4444]", text: "text-[#EF4444]" };
    case "rough_around_edges":
      return { bg: "bg-[#F59E0B]", text: "text-[#F59E0B]" };
    default:
      return { bg: "bg-[#10B981]", text: "text-[#10B981]" };
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getCodePreview(code: string, maxLines = 5): string {
  const lines = code.trim().split("\n");
  if (lines.length <= maxLines) return code;
  return lines.slice(0, maxLines).join("\n");
}

export function RoastCard({
  id,
  code,
  language,
  score,
  verdict,
  roastQuote,
  lineCount,
  createdAt,
}: RoastCardProps) {
  const verdictColors = getVerdictColor(verdict);
  const codePreview = getCodePreview(code, 5);

  return (
    <CardRoot className="w-full max-w-[520px] gap-4 p-5">
      <div className="flex items-start gap-4">
        <ScoreRing score={score} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-[family:var(--font-secondary)] text-[22px] font-bold text-[#FAFAFA]">
              Roast #{id.slice(0, 8)}
            </span>
            <span className="font-mono text-[13px] font-medium text-[#6B7280]">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={twMerge("size-3 rounded-full", verdictColors.bg)} />
        <span className={twMerge("font-mono text-[16px] font-medium", verdictColors.text)}>
          {verdict.replace(/_/g, " ")}
        </span>
      </div>

      <p className="font-[family:var(--font-secondary)] text-[16px] leading-relaxed text-[#FAFAFA]">
        {roastQuote || "No roast quote available"}
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 font-mono text-[13px] text-[#6B7280]">
          {language}
        </span>
        <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 font-mono text-[13px] text-[#6B7280]">
          {lineCount} lines
        </span>
      </div>

      <CodeBlock
        code={codePreview}
        language={language}
        maxHeight="120px"
      />

      <Link
        href={`/roast/${id}`}
        className="inline-flex items-center justify-center rounded-full bg-[#FF8400] px-4 py-2.5 font-[family:var(--font-secondary)] text-[14px] font-bold text-[#111111] transition-colors hover:bg-[#E67700]"
      >
        View roast
      </Link>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-[#6B7280]">
          lang: {language} · {lineCount} lines · {new Date(createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </CardRoot>
  );
}