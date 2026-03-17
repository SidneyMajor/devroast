"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { StatsMetrics } from "@/components/ui/stats-metrics";
import { CodeEditor, MAX_CODE_LENGTH } from "@/components/code-editor";
import { TableRowRoot, TableRowRank, TableRowScore, TableRowCode, TableRowLanguage } from "@/components/ui/table-row";

export default function Home() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);

  const isOverLimit = code.length > MAX_CODE_LENGTH;

  return (
    <div className="flex flex-col items-center px-5 pt-10">
      <div className="flex w-full max-w-[780px] flex-col gap-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-mono text-[36px] font-bold leading-tight">
            <span className="text-[#10B981]">$</span>{" "}
            <span className="text-[#FAFAFA]">paste your code. get roasted.</span>
          </h1>
          <p className="font-[family:var(--font-secondary)] text-sm text-[#6B7280]">
            // drop your code below and we&apos;ll rate it — brutally honest or full roast mode
          </p>
        </div>

        {/* Code Editor */}
        <CodeEditor
          placeholder="paste your code here..."
          value={code}
          onChange={setCode}
        />

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
            <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
              // maximum sarcasm enabled
            </span>
          </div>
          <Button disabled={isOverLimit || !code.trim()}>roast_my_code</Button>
        </div>

        {/* Footer Stats */}
        <StatsMetrics />

        {/* Spacer */}
        <div className="h-[60px]" />

        {/* Leaderboard Preview */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-lg font-bold text-[#FAFAFA]">
              <span className="text-[#10B981]">//</span> shame_leaderboard
            </h2>
            <Link href="/leaderboard" className="font-mono text-xs text-[#6B7280] hover:text-[#FAFAFA] hover:bg-[#2A2A2A] py-1.5 px-3 transition-colors">
              view_all &gt;&gt;
            </Link>
          </div>
          
          <p className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
            // the worst code on the internet, ranked by shame
          </p>

          <div className="rounded-md border border-[#2A2A2A] overflow-hidden">
            <TableRowRoot>
              <TableRowRank>#1</TableRowRank>
              <TableRowScore>1.2</TableRowScore>
              <TableRowCode>function calculateTotal(items) {'{'} var total = 0; for (var i = 0; i {'<'} items.length; i++) {'{'} total = total + items[i].price; {'}'} return total; {'}'}</TableRowCode>
              <TableRowLanguage>javascript</TableRowLanguage>
            </TableRowRoot>
            <TableRowRoot>
              <TableRowRank>#2</TableRowRank>
              <TableRowScore>1.8</TableRowScore>
              <TableRowCode>var result = ''; for(var i=0; i{'<'}5; i++){'{'} result += i; {'}'} console.log(result);</TableRowCode>
              <TableRowLanguage>javascript</TableRowLanguage>
            </TableRowRoot>
            <TableRowRoot>
              <TableRowRank>#3</TableRowRank>
              <TableRowScore>2.1</TableRowScore>
              <TableRowCode>const sum = (arr) ={'>'} arr.map(x ={'>'} x * 2);</TableRowCode>
              <TableRowLanguage>javascript</TableRowLanguage>
            </TableRowRoot>
          </div>

          <div className="flex justify-center py-4">
            <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
              showing top 3 of 2,847 · <Link href="/leaderboard" className="hover:text-[#FAFAFA] transition-colors">view full leaderboard &gt;&gt;</Link>
            </span>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-[60px]" />
      </div>
    </div>
  );
}
