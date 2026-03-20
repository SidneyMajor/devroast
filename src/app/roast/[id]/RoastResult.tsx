"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock, type DiffLine } from "@/components/ui/diff-block";
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

function ShareButton({ roastId }: { roastId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const ogImageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/og?id=${roastId}`;
    try {
      await navigator.clipboard.writeText(ogImageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 border border-[#2A2A2A] px-4 py-2 font-mono text-[12px] text-[#FAFAFA] transition-colors hover:border-[#4B5563]"
    >
      <span className="text-[#22C55E]">$</span>
      <span>{copied ? "copied!" : "share_roast"}</span>
    </button>
  );
}

export function RoastResult({ roast, analysisItems }: RoastResultProps) {
  const verdictVariant = roast.score <= 2 ? "critical" : roast.score <= 5 ? "warning" : "good";

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-10 py-10">
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center gap-12">
          <ScoreRing score={roast.score} />

          <div className="flex flex-1 flex-col gap-4">
            <Badge label={`verdict: ${roast.verdict}`} variant={verdictVariant} />
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
            <div className="flex items-center gap-3">
              <ShareButton roastId={roast.id} />
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
