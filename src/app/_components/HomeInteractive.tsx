"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { CodeEditor, MAX_CODE_LENGTH, type Language } from "@/components/code-editor";

interface HomeInteractiveProps {
  stats: {
    totalSubmissions: number;
    avgScore: number;
  };
  languages: Language[];
}

export function HomeInteractive({ stats, languages }: HomeInteractiveProps) {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);

  const isOverLimit = code.length > MAX_CODE_LENGTH;

  return (
    <div className="flex flex-col items-center px-5 pt-10">
      <div className="flex w-full max-w-[780px] flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-mono text-[36px] font-bold leading-tight">
            <span className="text-[#10B981]">$</span>{" "}
            <span className="text-[#FAFAFA]">paste your code. get roasted.</span>
          </h1>
          <p className="font-[family:var(--font-secondary)] text-sm text-[#6B7280]">
            // drop your code below and we&apos;ll rate it — brutally honest or full roast mode
          </p>
        </div>

        <CodeEditor
          placeholder="paste your code here..."
          value={code}
          onChange={setCode}
          languages={languages}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
            <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
              // maximum sarcasm enabled
            </span>
          </div>
          <Button disabled={isOverLimit || !code.trim()}>roast_my_code</Button>
        </div>
      </div>
    </div>
  );
}
