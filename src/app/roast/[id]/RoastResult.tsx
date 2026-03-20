"use client";

import { Suspense, useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock, type DiffLine } from "@/components/ui/diff-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { Badge } from "@/components/ui/badge";

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
    suggestedFix?: string | null;
  };
  analysisItems: AnalysisItem[];
}

function parseDiff(diffText: string | null | undefined): DiffLine[] {
  if (!diffText) return [];

  return diffText
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      if (line.startsWith("- ") || line.startsWith("-")) {
        return { diffType: "removed" as const, content: line.slice(2) || line.slice(1) };
      }
      if (line.startsWith("+ ") || line.startsWith("+")) {
        return { diffType: "added" as const, content: line.slice(2) || line.slice(1) };
      }
      return { diffType: "context" as const, content: line.slice(2) || line };
    });
}

function ShareButton({ roastId }: { roastId: string }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleShare = async () => {
    const ogImageUrl = `${window.location.origin}/api/og?id=${roastId}`;
    try {
      await navigator.clipboard.writeText(ogImageUrl);
      setCopied(true);
      setShowPreview(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setCopied(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 border border-[#2A2A2A] px-4 py-2 font-mono text-[12px] text-[#FAFAFA] transition-colors hover:border-[#4B5563]"
      >
        <span className="text-[#22C55E]">$</span>
        <span>{copied ? "copied!" : "share_roast"}</span>
      </button>

      {showPreview && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70"
            onClick={closePreview}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="overflow-hidden rounded-xl border border-[#2A2A2A] shadow-2xl">
              <img
                src={`${window.location.origin}/api/og?id=${roastId}`}
                alt="OG Preview"
                className="w-[600px] object-cover"
              />
              <div className="flex items-center justify-between bg-[#0A0A0A] p-3">
                <span className="font-mono text-[12px] text-[#22C55E]">$ copied!</span>
                <button
                  onClick={closePreview}
                  className="font-mono text-[12px] text-[#6B7280] transition-colors hover:text-white"
                >
                  [×]
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function RoastResult({ roast, analysisItems }: RoastResultProps) {
  const verdictVariant =
    roast.verdict === "needs_serious_help"
      ? "critical"
      : roast.verdict === "rough_around_edges"
        ? "warning"
        : "good";

  const verdictLabel = roast.verdict.replace(/_/g, " ");

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center px-5 py-10">
      <div className="flex w-full max-w-[980px] flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#10B981]">//</span>
            <h1 className="font-mono text-[20px] font-bold text-[#FAFAFA]">roast_details</h1>
          </div>

          <div className="flex flex-col gap-10 rounded-lg border border-[#1F1F1F] bg-[radial-gradient(circle_at_50%_45%,#111111_0%,#0f172a_40%,#0a0a0a_100%)] p-6 md:flex-row md:items-center md:justify-between md:gap-12">
            <div className="flex items-center justify-center md:flex-shrink-0 md:pr-4">
              <ScoreRing score={roast.score} size={160} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-5 md:max-w-[640px]">
              <Badge variant={verdictVariant} size="md" className="truncate" title={roast.verdict}>
                {verdictLabel}
              </Badge>
              <p className="max-w-xl text-justify font-mono text-[18px] font-normal leading-[1.7] text-[#FAFAFA]">
                &quot;{roast.roastQuote}&quot;
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[12px] text-[#4B5563]">lang: {roast.language}</span>
                <span className="text-[12px] text-[#4B5563]">·</span>
                <span className="font-mono text-[12px] text-[#4B5563]">{roast.lineCount} lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-[#6B7280]">
                  {roast.roastMode ? "🔥 roast mode" : "💎 honest mode"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Suspense fallback={<span className="font-mono text-[12px] text-[#6B7280]">loading share...</span>}>
                  <ShareButton roastId={roast.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">your_submission</h2>
          </div>
          <CodeBlock code={roast.code} language={roast.language} maxHeight="424px" />
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">detailed_analysis</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

        <div className="h-px w-full bg-[#2A2A2A]" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">suggested_fix</h2>
          </div>
          <DiffBlock
            lines={parseDiff(roast.suggestedFix)}
            filename={`${roast.language}: code → improved`}
          />
        </div>
      </div>
    </div>
  );
}
