import { twMerge } from "tailwind-merge";
import { highlightDiffLines } from "@/lib/shiki-highlighter";

export interface DiffLine {
  diffType: "added" | "removed" | "context";
  content: string;
}

export interface DiffBlockProps {
  lines: DiffLine[];
  filename?: string;
  language?: string;
}

const diffStyles = {
  added: {
    bg: "bg-[#0D3320]",
    border: "border-[#238636]",
    prefix: "text-[#238636]",
  },
  removed: {
    bg: "bg-[#3D1F1F]",
    border: "border-[#DA3633]",
    prefix: "text-[#DA3633]",
  },
  context: {
    bg: "bg-transparent",
    border: "border-transparent",
    prefix: "text-[#6E7681]",
  },
};

async function DiffLineComponent({
  line,
  lineNumber,
}: {
  line: { diffType: "added" | "removed" | "context"; html: string };
  lineNumber: number;
}) {
  const styles = diffStyles[line.diffType];
  const prefix = line.diffType === "added" ? "+" : line.diffType === "removed" ? "-" : " ";

  return (
    <div
      className={twMerge(
        "flex items-center gap-3 border-l-2 px-3 py-1.5",
        styles.bg,
        styles.border
      )}
    >
      <span className="select-none w-5 text-left font-mono text-[12px] font-bold text-[#6E7681]">
        {lineNumber}
      </span>
      <span className={twMerge("select-none w-4 font-mono text-[12px] font-bold", styles.prefix)}>
        {prefix}
      </span>
      <span
        className="flex-1 font-mono text-[13px] text-[#E1E4E8] whitespace-pre"
        dangerouslySetInnerHTML={{ __html: line.html }}
      />
    </div>
  );
}

export async function DiffBlock({
  lines,
  filename,
  language = "javascript",
}: DiffBlockProps) {
  const displayFilename = filename || "suggested_fix.diff";

  const highlightedLines =
    lines.length > 0
      ? await highlightDiffLines(lines, language)
      : [];

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
          {highlightedLines.length > 0 ? (
            highlightedLines.map((_, index) => (
              <span
                key={index}
                className="select-none font-mono text-[12px] leading-[1.5] text-[#6E7681]"
              >
                {index + 1}
              </span>
            ))
          ) : (
            <span className="select-none font-mono text-[12px] leading-[1.5] text-[#6E7681]">
              1
            </span>
          )}
        </div>
        <div className="diff-block-scroll flex flex-1 flex-col overflow-auto">
          {highlightedLines.length > 0 ? (
            highlightedLines.map((line, index) => (
              <DiffLineComponent key={index} line={line} lineNumber={index + 1} />
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