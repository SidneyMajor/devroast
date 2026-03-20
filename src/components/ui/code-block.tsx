"use client";

import { Suspense, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import type { ComponentProps, ReactNode } from "react";

async function highlightCode(code: string, language: string): Promise<string> {
  const { codeToHtml } = await import("shiki");
  return codeToHtml(code.trim(), {
    lang: language,
    theme: "vesper",
  });
}

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
  maxHeight?: string;
}

function CodeBlockContentInner({ code, language }: { code: string; language: string }) {
  const [highlighted, setHighlighted] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    highlightCode(code, language).then((html) => {
      setHighlighted(html);
      setLoading(false);
    });
  }, [code, language]);

  if (loading) {
    return (
      <CodeBlockContent>
        <pre className="font-mono text-[13px] text-[#6B7280]">Loading...</pre>
      </CodeBlockContent>
    );
  }

  return (
    <CodeBlockContent dangerouslySetInnerHTML={{ __html: highlighted }} />
  );
}

export function CodeBlock({ 
  code, 
  language = "javascript", 
  showHeader = false, 
  filename,
  maxHeight 
}: CodeBlockProps) {
  return (
    <CodeBlockRoot className={maxHeight ? "overflow-hidden" : undefined}>
      {showHeader && <CodeBlockHeader filename={filename} />}
      <div className="flex" style={maxHeight ? { maxHeight } : undefined}>
        <CodeBlockLineNumbers lineCount={code.trim().split("\n").length} />
        <div className="code-block-scroll flex-1 overflow-auto">
          <Suspense fallback={
            <CodeBlockContent>
              <pre className="font-mono text-[13px] text-[#6B7280]">Loading...</pre>
            </CodeBlockContent>
          }>
            <CodeBlockContentInner code={code} language={language} />
          </Suspense>
        </div>
      </div>
      <style jsx>{`
        .code-block-scroll {
          scrollbar-color: #2a2a2a #0f0f0d;
          scrollbar-width: thin;
        }
        .code-block-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .code-block-scroll::-webkit-scrollbar-track {
          background: #0f0f0d;
        }
        .code-block-scroll::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 9999px;
          border: 2px solid #0f0f0d;
        }
        .code-block-scroll::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </CodeBlockRoot>
  );
}
