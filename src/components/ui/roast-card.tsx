"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ScoreRing } from "@/components/ui/score-ring";
import { CardRoot } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";

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

function getVerdictMeta(verdict: string): { variant: "critical" | "warning" | "good"; label: string } {
  switch (verdict) {
    case "needs_serious_help":
      return { variant: "critical", label: "needs_serious_help" };
    case "rough_around_edges":
      return { variant: "warning", label: "rough_around_edges" };
    default:
      return { variant: "good", label: verdict };
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "há instantes";
  if (diffMins < 60) return `há ${diffMins}m`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 30) return `há ${diffDays}d`;
  return date.toLocaleDateString("pt-PT", { month: "short", year: "numeric" });
}

function getCodePreview(code: string, maxLines = 3): string {
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
  const verdictMeta = getVerdictMeta(verdict);
  const codePreview = getCodePreview(code, 3);
  const fileLabel = `${language || "snippet"}.${(language || "txt").slice(0, 3)}`;
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeAgo(formatTimeAgo(createdAt));
  }, [createdAt]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <CardRoot className="w-full max-w-[540px] gap-4 rounded-lg border-[#1F1F1F] bg-[#0B0B0F] p-5 shadow-[0_12px_36px_-22px_rgba(0,0,0,0.55)]">
      <div className="relative flex h-[180px] items-center justify-center overflow-hidden rounded-md bg-[radial-gradient(circle_at_50%_45%,#111111_0%,#0f172a_40%,#0a0a0a_100%)]">
        <ScoreRing score={score} size={155} className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="font-[family:var(--font-secondary)] text-[22px] font-bold text-[#FAFAFA]">
          Roast #{id.slice(0, 8)}
        </span>
        <span
          className="font-mono text-[13px] font-medium text-[#9CA3AF]"
          suppressHydrationWarning
        >
          {mounted ? timeAgo || "…" : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant={verdictMeta.variant}
          size="md"
          className="max-w-full truncate"
          title={verdict}
        >
          {verdictMeta.label.replace(/_/g, " ")}
        </Badge>
      </div>

      <p
        className="font-[family:var(--font-secondary)] text-[16px] leading-relaxed text-[#FAFAFA] italic truncate"
      >
        {roastQuote ? `"${roastQuote}"` : "No roast quote available"}
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[#2A2A2A] bg-[#0F0F12] px-3 py-1.5 font-mono text-[13px] text-[#9CA3AF]">
          {language}
        </span>
        <span className="rounded-full border border-[#2A2A2A] bg-[#0F0F12] px-3 py-1.5 font-mono text-[13px] text-[#9CA3AF]">
          {lineCount} lines
        </span>
      </div>

      <div className="hidden w-full md:block">
        <CodeBlock
          code={codePreview}
          language={language === "auto" ? "javascript" : language}
          showHeader
          filename={fileLabel}
          maxHeight="96px"
        />
      </div>

      <Link
        href={`/roast/${id}`}
        className="inline-flex items-center justify-center self-start rounded-full bg-[#FF8400] px-4 py-2.5 font-[family:var(--font-secondary)] text-[14px] font-bold text-[#111111] transition-colors hover:bg-[#E67700]"
      >
        View roast
      </Link>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-[#9CA3AF]">
          lang: {language} | {lineCount} lines | {new Date(createdAt).toLocaleDateString("pt-PT", { month: "short", year: "numeric" })}
        </span>
      </div>
    </CardRoot>
  );
}
