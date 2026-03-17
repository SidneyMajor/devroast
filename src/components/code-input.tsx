"use client";

import { useState } from "react";

export interface CodeInputProps {
  language?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function CodeInput({ language = "javascript", placeholder = "paste your code here...", value: controlledValue, onChange }: CodeInputProps) {
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue ?? internalValue;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!controlledValue) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const lines = value.split("\n");
  const lineCount = lines.length || 1;

  return (
    <div className="flex flex-col rounded-md border border-[#2A2A2A] bg-[#111111] overflow-hidden">
      <div className="flex h-10 items-center gap-3 border-b border-[#2A2A2A] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
        <div className="flex-1" />
        <span className="font-mono text-xs text-[#6B7280]">{language}</span>
      </div>
      <div className="flex min-h-[320px] max-h-[400px]">
        <div className="flex flex-col gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0D] py-3 pr-2 pl-3 text-right">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="font-mono text-[13px] text-[#6B7280] leading-[1.5]">
              {i + 1}
            </span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 resize-none bg-transparent p-3 font-mono text-[13px] text-[#FAFAFA] placeholder:text-[#6B7280] focus:outline-none leading-[1.5]"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
