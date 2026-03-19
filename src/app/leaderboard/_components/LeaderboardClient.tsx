"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { codeToHtml } from "shiki";
import { CodeBlockRoot, CodeBlockLineNumbers } from "@/components/ui/code-block";
import { twMerge } from "tailwind-merge";

interface LeaderboardEntryData {
  id: string;
  code: string;
  language: string;
  score: number;
  roastMode: boolean;
  lineCount?: number;
  verdict?: string;
  highlightedCode?: string;
}

async function highlightCode(code: string, language: string): Promise<string> {
  try {
    return await codeToHtml(code.trim(), {
      lang: language,
      theme: "vesper",
    });
  } catch {
    return `<pre><code>${code.trim()}</code></pre>`;
  }
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
  const hasMoreLines = lines.length > 3;

  const lineHeight = 20;
  const padding = 16;
  const maxVisibleLines = 3;
  const maxHeight = hasMoreLines ? (maxVisibleLines * lineHeight) + padding : undefined;

  return (
    <div className="flex flex-col rounded-md border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
      <Link
        href={`/roast/${entry.id}`}
        className="flex h-10 items-center justify-between border-b border-[#2A2A2A] px-4 transition-colors hover:bg-[#111111]"
      >
        <div className="flex items-center gap-4">
          <span className={twMerge(
            "font-mono text-xs font-bold",
            isTop3 ? "text-[#F59E0B]" : "text-[#6B7280]"
          )}>
            #{rank}
          </span>
          <span className="font-mono text-xs font-bold text-[#EF4444]">{entry.score}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#6B7280]">{entry.language}</span>
          <span className="font-mono text-xs text-[#6B7280]">
            {entry.roastMode ? "🔥" : "💀"}
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
              dangerouslySetInnerHTML={{ __html: entry.highlightedCode || entry.code }}
            />
          </div>
        </CodeBlockRoot>
      </div>
      {hasMoreLines && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
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

export function LeaderboardClient({ items }: { items: LeaderboardEntryData[] }) {
  const [highlightedItems, setHighlightedItems] = useState<LeaderboardEntryData[]>(items);

  useEffect(() => {
    async function highlightAll() {
      const highlighted = await Promise.all(
        items.map(async (item) => ({
          ...item,
          highlightedCode: item.highlightedCode || await highlightCode(item.code, item.language),
        }))
      );
      setHighlightedItems(highlighted);
    }
    highlightAll();
  }, [items]);

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
    <div className="flex flex-col gap-4">
      {highlightedItems.map((item, index) => (
        <LeaderboardEntry key={item.id} entry={item} rank={index + 1} />
      ))}
    </div>
  );
}
