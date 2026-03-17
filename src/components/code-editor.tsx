"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { twMerge } from "tailwind-merge";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
] as const;

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  placeholder?: string;
  filename?: string;
}

export function CodeEditor({
  value: controlledValue,
  onChange,
  language: controlledLanguage,
  onLanguageChange,
  placeholder = "paste your code here...",
}: CodeEditorProps) {
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue ?? internalValue;
  const lines = value.split("\n");
  const lineCount = lines.length || 1;

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
      onLanguageChange?.(newLang);
    },
    [onLanguageChange]
  );

  const currentLanguage = controlledLanguage || "javascript";

  return (
    <div className="flex flex-col rounded-md border border-[#2A2A2A] bg-[#111111] overflow-hidden">
      <div className="flex h-10 items-center gap-3 border-b border-[#2A2A2A] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
        <div className="flex-1" />
        <select
          value={currentLanguage}
          onChange={handleLanguageChange}
          className="bg-transparent font-mono text-xs text-[#6B7280] focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value} className="bg-[#111111]">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex relative min-h-[320px] max-h-[400px]">
        <div className="flex flex-col gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0D] py-3 pr-2 pl-3 text-right select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="font-mono text-[13px] text-[#6B7280] leading-[1.5]">
              {i + 1}
            </span>
          ))}
        </div>
        <div className="flex-1 relative overflow-auto">
          <SyntaxHighlighter
            language={currentLanguage}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: "12px",
              background: "transparent",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
            showLineNumbers={false}
            wrapLines={false}
          >
            {value || placeholder}
          </SyntaxHighlighter>
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={twMerge(
              "absolute inset-0 w-full h-full resize-none bg-transparent font-mono text-[13px]",
              "text-transparent caret-[#FAFAFA]",
              "focus:outline-none leading-[1.5] p-3",
              !value && "text-[#6B7280]"
            )}
            spellCheck={false}
            style={{ lineHeight: "1.5" }}
          />
        </div>
      </div>
    </div>
  );
}
