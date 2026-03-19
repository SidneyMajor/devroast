"use client";

import { useState } from "react";
import { CodeBlockRoot, CodeBlockLineNumbers, CodeBlockContent } from "@/components/ui/code-block";

interface LeaderboardEntryData {
  id: string;
  code: string;
  language: string;
  score: number;
  roastMode: boolean;
  lineCount?: number;
  verdict?: string;
}

function LeaderboardEntry({
  entry,
  rank,
}: {
  entry: LeaderboardEntryData;
  rank: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isTop3 = rank <= 3;
  const lines = entry.code.split("\n");
  const hasMoreLines = lines.length > 5;

  return (
    <div className="flex flex-col rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
      <div className="flex h-12 items-center justify-between border-b border-[#2A2A2A] px-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] text-[#4B5563]">#</span>
            <span
              className={`font-mono text-[13px] font-bold ${
                isTop3 ? "text-[#F59E0B]" : "text-[#FAFAFA]"
              }`}
            >
              {rank}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#4B5563]">score:</span>
            <span className="font-mono text-[13px] font-bold text-[#EF4444]">
              {entry.score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-[#6B7280]">
            {entry.language}
          </span>
          <span className="font-mono text-[12px] text-[#4B5563]">
            {lines.length} lines
          </span>
        </div>
      </div>
      <div
        className={isExpanded ? "overflow-auto" : "overflow-hidden"}
        style={{ maxHeight: isExpanded ? "none" : "120px" }}
      >
        <CodeBlockRoot className="bg-[#111111]">
          <div className="flex h-full">
            <CodeBlockLineNumbers
              lineCount={lines.length}
              className="!py-3 !px-3.5"
            />
            <CodeBlockContent className="!py-3 text-xs leading-[22px]">
              {entry.code}
            </CodeBlockContent>
          </div>
        </CodeBlockRoot>
      </div>
      {hasMoreLines && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-center border-t border-[#2A2A2A] py-2 font-mono text-[11px] text-[#6B7280] hover:bg-[#1A1A1A] hover:text-[#FAFAFA] transition-colors"
        >
          {isExpanded ? "show less" : `show more (${lines.length} lines)`}
        </button>
      )}
    </div>
  );
}

export function LeaderboardClient({ items }: { items: LeaderboardEntryData[] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border border-[#2A2A2A] bg-[#0A0A0A] py-12">
        <span className="font-mono text-sm text-[#6B7280]">
          // no codes roasted yet. be the first!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, index) => (
        <LeaderboardEntry key={item.id} entry={item} rank={index + 1} />
      ))}
    </div>
  );
}
