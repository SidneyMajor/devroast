"use client";

import { useEffect, useState } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";
import {
  CodeBlockContent,
  CodeBlockLineNumbers,
} from "@/components/ui/code-block";

export interface LeaderboardRowProps {
  rank: number;
  score: number;
  language: string;
  code: string;
  roastMode: boolean;
  lineCount?: number;
  verdict?: string;
  className?: string;
}

export function LeaderboardRow({
  rank,
  score,
  language,
  code,
  roastMode,
  lineCount,
  verdict,
  className,
}: LeaderboardRowProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const codeLines = code.trim().split("\n");
  const totalLines = lineCount ?? codeLines.length;
  const preview = codeLines.slice(0, 3).join("\n");

  useEffect(() => {
    let mounted = true;
    codeToHtml(code.trim(), { lang: language || "javascript", theme: "vesper" })
      .then((html) => {
        if (mounted) setHighlighted(html);
      })
      .catch(() => {
        if (mounted) setHighlighted(null);
      });
    return () => {
      mounted = false;
    };
  }, [code, language]);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={twMerge(
        "border-b border-[#2A2A2A] bg-[#0A0A0A] px-5 py-4 last:border-b-0",
        className,
      )}
    >
      <Collapsible.Trigger className="grid grid-cols-[48px_70px_1fr_120px_80px] items-start gap-4 w-full text-left hover:bg-[#111111] transition-colors">
        <span className="font-mono text-[13px] text-[#6B7280]">#{rank}</span>
        <span className="font-mono text-[13px] font-bold text-[#EF4444]">
          {score.toFixed(1)}
        </span>
        <pre className="font-mono text-[12px] leading-[18px] whitespace-pre-wrap text-[#6B7280] max-h-[72px] overflow-hidden">
          {preview}
          {codeLines.length > 3 ? " …" : ""}
        </pre>
        <span className="font-mono text-[12px] text-[#10B981] capitalize">{language}</span>
        <div className="flex flex-col items-end justify-center gap-1">
          <span className="rounded bg-[#111111] px-2 py-1 font-mono text-[11px] text-[#F59E0B] uppercase tracking-wide">
            {roastMode ? "roast" : "honest"}
          </span>
          <span className="font-mono text-[11px] text-[#4B5563]">
            {totalLines} {totalLines === 1 ? "line" : "lines"}
          </span>
          {verdict && (
            <span className="font-mono text-[11px] text-[#6B7280]">
              verdict: {verdict.replaceAll("_", " ")}
            </span>
          )}
        </div>
      </Collapsible.Trigger>

      <Collapsible.Panel className="overflow-hidden">
        <div className="mt-3 flex rounded-md border border-[#2A2A2A] bg-[#0D0D0D]">
          <CodeBlockLineNumbers
            lineCount={totalLines}
            className="!py-3 !px-3.5"
          />
          <CodeBlockContent className="!py-3 !text-[13px] leading-[20px] max-h-[260px] overflow-auto">
            {highlighted ? (
              <div
                className="[&_pre]:!bg-transparent [&_pre]:p-0 [&_code]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-[#c5c8c6]">{code}</pre>
            )}
          </CodeBlockContent>
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
