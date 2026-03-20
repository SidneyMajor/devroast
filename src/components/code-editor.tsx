"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { twMerge } from "tailwind-merge";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("php", php);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);

export const MAX_CODE_LENGTH = 2000;

export interface Language {
  id: string;
  label: string;
}

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  languages?: Language[];
  placeholder?: string;
  maxLength?: number;
}

function doDetectLanguage(code: string): string | null {
  if (!code || code.length < 20) return null;
  try {
    const result = hljs.highlightAuto(code);
    return result.language || null;
  } catch {
    return null;
  }
}

export function CodeEditor({
  value: controlledValue,
  onChange,
  language: controlledLanguage,
  onLanguageChange,
  languages = [],
  placeholder = "paste your code here...",
  maxLength = MAX_CODE_LENGTH,
}: CodeEditorProps) {
  const [internalValue, setInternalValue] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const LINE_HEIGHT_PX = 20;
  const PADDING_Y = 24; // shared vertical padding for textarea + highlighter

  const value = controlledValue ?? internalValue;
  const lines = value.split("\n");
  const lineCount = lines.length || 1;
  const charCount = value.length;
  const isOverLimit = charCount > maxLength;
  const contentHeight = Math.max(
    lineCount * LINE_HEIGHT_PX + PADDING_Y,
    360
  );

  useEffect(() => {
    if (value && value.length > 20 && isAutoDetected) {
      const detected = doDetectLanguage(value);
      if (detected) {
        setCurrentLanguage(detected);
      }
    }
  }, [value, isAutoDetected]);

  useEffect(() => {
    if (controlledLanguage === "auto") {
      setIsAutoDetected(true);
    }
  }, [controlledLanguage]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (!controlledValue) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [controlledValue, onChange]
  );

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLang = e.target.value;
      if (newLang === "auto") {
        setIsAutoDetected(true);
        const detected = doDetectLanguage(value);
        if (detected) {
          setCurrentLanguage(detected);
          onLanguageChange?.("auto");
        } else {
          setCurrentLanguage("auto");
          onLanguageChange?.("auto");
        }
      } else {
        setCurrentLanguage(newLang);
        setIsAutoDetected(false);
        onLanguageChange?.(newLang);
      }
    },
    [onLanguageChange, value]
  );

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollContainerRef.current.scrollTop;
    }
  }, []);

  const displayLanguage = isAutoDetected && currentLanguage !== "auto" 
    ? currentLanguage 
    : (controlledLanguage || currentLanguage);

  return (
    <div className="flex flex-col rounded-md border border-[#2A2A2A] bg-[#111111] overflow-hidden">
      <div className="flex h-10 items-center gap-3 border-b border-[#2A2A2A] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {isAutoDetected && currentLanguage !== "auto" && (
            <span className="rounded bg-[#22C55E]/20 px-2 py-0.5 font-mono text-[10px] text-[#22C55E]">
              auto: {currentLanguage}
            </span>
          )}
          <select
            value={isAutoDetected ? "auto" : displayLanguage}
            onChange={handleLanguageChange}
            className="bg-transparent font-mono text-xs text-[#6B7280] focus:outline-none cursor-pointer"
          >
            <option value="auto" className="bg-[#111111]">
              auto-detect
            </option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-[#111111]">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex h-[360px] overflow-hidden">
        <div
          ref={lineNumbersRef}
          className="h-full shrink-0 overflow-hidden border-r border-[#2A2A2A] bg-[#0F0F0D] py-3 pr-2 pl-3 text-right"
          style={{ width: "40px" }}
        >
          <div className="flex flex-col gap-1.5">
            {Array.from({ length: lineCount }, (_, i) => (
              <span
                key={i}
                className="font-mono text-[13px] text-[#6B7280] leading-[1.5]"
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="relative h-full flex-1">
          <div
            ref={scrollContainerRef}
            className="relative h-full overflow-auto code-editor-scroll"
            onScroll={handleScroll}
          >
            <SyntaxHighlighter
              language={displayLanguage}
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: "12px",
                background: "transparent",
                fontSize: "13px",
                lineHeight: `${LINE_HEIGHT_PX}px`,
                minHeight: "100%",
                height: `${contentHeight}px`,
                whiteSpace: "pre",
              }}
              showLineNumbers={false}
              wrapLines={false}
              lineProps={{ style: { whiteSpace: "pre" } }}
            >
              {value || placeholder}
            </SyntaxHighlighter>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className={twMerge(
                "absolute inset-0 z-10 w-full resize-none bg-transparent font-mono text-[13px]",
                "text-transparent caret-[#FAFAFA]",
                "focus:outline-none p-3 overflow-hidden",
                !value && "text-[#6B7280]"
              )}
              spellCheck={false}
              style={{
                lineHeight: `${LINE_HEIGHT_PX}px`,
                height: `${contentHeight}px`,
                minHeight: "100%",
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          "flex justify-end px-3 py-1.5 border-t border-[#2A2A2A] font-mono text-xs",
          isOverLimit ? "text-[#EF4444]" : "text-[#6B7280]"
        )}
      >
        {charCount.toLocaleString("en-US")} /{" "}
        {maxLength.toLocaleString("en-US")}
      </div>
      <style jsx>{`
        .code-editor-scroll {
          scrollbar-color: #2a2a2a #0f0f0d;
          scrollbar-width: thin;
        }
        .code-editor-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .code-editor-scroll::-webkit-scrollbar-track {
          background: #0f0f0d;
        }
        .code-editor-scroll::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 9999px;
          border: 2px solid #0f0f0d;
        }
        .code-editor-scroll::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
