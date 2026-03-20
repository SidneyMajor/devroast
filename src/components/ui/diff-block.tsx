"use client";

import { twMerge } from "tailwind-merge";

export interface DiffLine {
  diffType: "added" | "removed" | "context";
  content: string;
}

export interface DiffBlockProps {
  lines: DiffLine[];
  filename?: string;
  language?: string;
}

function DiffLineComponent({ line }: { line: DiffLine }) {
  const styles = {
    added: {
      bg: "bg-[#0D3320]",
      border: "border-[#238636]",
      text: "text-[#9CDCFE]",
    },
    removed: {
      bg: "bg-[#3D1F1F]",
      border: "border-[#DA3633]",
      text: "text-[#F97583]",
    },
    context: {
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-[#E1E4E8]",
    },
  };

  const style = styles[line.diffType];

  return (
    <div className={`flex items-center gap-3 border-l-2 px-3 py-2 ${style.bg} ${style.border}`}>
      <span className={`w-5 text-left font-mono text-[12px] font-bold ${style.text}`}>
        {line.diffType === "added" ? "+" : line.diffType === "removed" ? "-" : " "}
      </span>
      <pre className={`flex-1 font-mono text-[13px] ${style.text} whitespace-pre`}>
        {line.content}
      </pre>
    </div>
  );
}

export function DiffBlock({ lines, filename, language = "diff" }: DiffBlockProps) {
  const displayFilename = filename || "suggested_fix.diff";

  return (
    <div className="flex flex-col rounded-md border border-[#30363D] bg-[#0D1117] overflow-hidden">
      <div className="flex h-10 items-center gap-3 border-b border-[#30363D] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#DA3633]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#238636]" />
        <div className="flex-1" />
        <span className="font-mono text-xs text-[#8B949E]">{displayFilename}</span>
      </div>
      <div className="flex" style={{ maxHeight: "424px" }}>
        <div className="flex flex-col border-r border-[#30363D] bg-[#161B22] py-3 pr-3 pl-4 text-right">
          {lines.length > 0 ? (
            lines.map((_, index) => (
              <span key={index} className="font-mono text-[12px] leading-[1.5] text-[#6E7681]">
                {index + 1}
              </span>
            ))
          ) : (
            <span className="font-mono text-[12px] leading-[1.5] text-[#6E7681]">1</span>
          )}
        </div>
        <div className="diff-block-scroll flex flex-1 flex-col overflow-auto">
          {lines.length > 0 ? (
            lines.map((line, index) => (
              <DiffLineComponent key={index} line={line} />
            ))
          ) : (
            <div className="px-4 py-3 text-center font-mono text-[12px] text-[#8B949E]">
              no suggestions available
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .diff-block-scroll {
          scrollbar-color: #30363d #0d1117;
          scrollbar-width: thin;
        }
        .diff-block-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .diff-block-scroll::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .diff-block-scroll::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 9999px;
          border: 2px solid #0d1117;
        }
        .diff-block-scroll::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
      `}</style>
    </div>
  );
}
