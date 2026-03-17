import { CodeBlockRoot, CodeBlockHeader, CodeBlockLineNumbers, CodeBlockContent } from "@/components/ui/code-block";

const leaderboardData = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
  },
  {
    rank: 2,
    score: 2.8,
    language: "python",
    code: `import os
os.system(input())
# no sanitization needed
exec(input())`,
  },
  {
    rank: 3,
    score: 3.1,
    language: "rust",
    code: `unsafe {
    std::mem::transmute(user_input)
}`,
  },
  {
    rank: 4,
    score: 4.5,
    language: "java",
    code: `public class Login {
    public boolean checkPassword(String password) {
        return password == "admin123";
    }
}`,
  },
  {
    rank: 5,
    score: 5.0,
    language: "typescript",
    code: `const fetch = async () => {
  await fetch('/api/admin/users');
}`,
  },
];

function LeaderboardEntry({ entry }: { entry: typeof leaderboardData[number] }) {
  const isTop3 = entry.rank <= 3;
  const lines = entry.code.split("\n");

  return (
    <div className="flex flex-col rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
      <div className="flex h-12 items-center justify-between border-b border-[#2A2A2A] px-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] text-[#4B5563]">#</span>
            <span className={`font-mono text-[13px] font-bold ${isTop3 ? "text-[#F59E0B]" : "text-[#FAFAFA]"}`}>
              {entry.rank}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#4B5563]">score:</span>
            <span className="font-mono text-[13px] font-bold text-[#EF4444]">{entry.score}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-[#6B7280]">{entry.language}</span>
          <span className="font-mono text-[12px] text-[#4B5563]">{lines.length} lines</span>
        </div>
      </div>
      <CodeBlockRoot className="h-[120px] overflow-hidden rounded-b-lg bg-[#111111]">
        <div className="flex h-full">
          <CodeBlockLineNumbers lineCount={lines.length} className="!py-3 !px-3.5" />
          <CodeBlockContent className="!py-3 text-xs leading-[22px]">
            {entry.code}
          </CodeBlockContent>
        </div>
      </CodeBlockRoot>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col gap-10 px-20 py-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-[#22C55E]">›</span>
          <h1 className="font-mono text-[28px] font-bold text-[#FAFAFA]">shame_leaderboard</h1>
        </div>
        <p className="font-mono text-[14px] text-[#6B7280]">// the most roasted code on the internet</p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-[#4B5563]">2,847 submissions</span>
          <span className="text-[12px] text-[#4B5563]">·</span>
          <span className="font-mono text-[12px] text-[#4B5563]">avg score: 4.2/10</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {leaderboardData.map((entry) => (
          <LeaderboardEntry key={entry.rank} entry={entry} />
        ))}
      </div>
    </div>
  );
}
