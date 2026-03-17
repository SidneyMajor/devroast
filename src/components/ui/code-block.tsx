import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";
import type { ComponentProps, ReactNode } from "react";

export interface CodeBlockRootProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export function CodeBlockRoot({ children, className, ...props }: CodeBlockRootProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col rounded-md border border-[#2A2A2A] bg-[#0D0D0D] overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CodeBlockHeaderProps extends ComponentProps<"div"> {
  children?: ReactNode;
  filename?: string;
}

export function CodeBlockHeader({ children, filename, className, ...props }: CodeBlockHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex h-10 items-center gap-3 border-b border-[#2A2A2A] px-4",
        className
      )}
      {...props}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
      <div className="flex-1" />
      {filename && (
        <span className="font-mono text-xs text-[#6B7280]">{filename}</span>
      )}
      {children}
    </div>
  );
}

export interface CodeBlockLineNumbersProps extends ComponentProps<"div"> {
  lineCount: number;
}

export function CodeBlockLineNumbers({ lineCount, className, ...props }: CodeBlockLineNumbersProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0D] py-3 pr-2 pl-3 text-right",
        className
      )}
      {...props}
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <span key={i} className="font-mono text-[13px] text-[#6B7280]">
          {i + 1}
        </span>
      ))}
    </div>
  );
}

export interface CodeBlockContentProps extends ComponentProps<"div"> {
  children?: ReactNode;
}

export function CodeBlockContent({ children, className, ...props }: CodeBlockContentProps) {
  return (
    <div
      className={twMerge(
        "flex-1 overflow-x-auto p-3 font-mono text-[13px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  showHeader?: boolean;
  filename?: string;
}

export async function CodeBlock({ code, language = "javascript", showHeader = false, filename }: CodeBlockProps) {
  const highlighted = await codeToHtml(code.trim(), {
    lang: language,
    theme: "vesper",
  });

  return (
    <CodeBlockRoot>
      {showHeader && <CodeBlockHeader filename={filename} />}
      <div className="flex">
        <CodeBlockLineNumbers lineCount={code.trim().split("\n").length} />
        <CodeBlockContent dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </CodeBlockRoot>
  );
}
