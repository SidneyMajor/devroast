"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeBlockRoot, CodeBlockLineNumbers } from "@/components/ui/code-block";
import { twMerge } from "tailwind-merge";

interface HomeLeaderboardRowProps {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
  highlightedCode: string;
  roastMode: boolean;
}

export function HomeLeaderboardRow({
  id,
  rank,
  score,
  language,
  code,
  highlightedCode,
  roastMode,
}: HomeLeaderboardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isTop3 = rank <= 3;
  const lines = code.split("\n");
  const hasMoreLines = lines.length > 3;
  const lineHeight = 20;
  const padding = 16;
  const maxVisibleLines = 3;
  const maxHeight = hasMoreLines ? (maxVisibleLines * lineHeight) + padding : undefined;

  return (
    <div className="flex flex-col rounded-md border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
      <Link
        href={`/roast/${rank}`}
        className="flex h-10 items-center justify-between border-b border-[#2A2A2A] px-4 transition-colors hover:bg-[#111111]"
      >
        <div className="flex items-center gap-4">
          <span className={twMerge(
            "font-mono text-xs font-bold",
            isTop3 ? "text-[#F59E0B]" : "text-[#6B7280]"
          )}>
            #{rank}
          </span>
          <span className="font-mono text-xs font-bold text-[#EF4444]">{score}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#6B7280]">{language}</span>
          <span className="font-mono text-xs text-[#6B7280]">
            {roastMode ? "🔥" : "💀"}
          </span>
        </div>
      </Link>
      <div
        className="transition-all duration-200"
      >
        <CodeBlockRoot className="bg-[#111111]">
          <div
            className="flex overflow-hidden"
            style={{ maxHeight: !isExpanded ? maxHeight : undefined }}
          >
            <CodeBlockLineNumbers lineCount={lines.length} className="!py-2 !px-2 !overflow-hidden" />
            <div
              className="flex-1 overflow-hidden p-3"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>
        </CodeBlockRoot>
      </div>
      {hasMoreLines && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className="flex w-full items-center justify-center border-t border-[#2A2A2A] py-1.5 font-mono text-[10px] text-[#6B7280] hover:bg-[#1A1A1A] hover:text-[#FAFAFA] transition-colors"
        >
          {isExpanded ? "show less" : `show more (${lines.length} lines)`}
        </button>
      )}
    </div>
  );
}
