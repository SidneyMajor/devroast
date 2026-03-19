import Link from "next/link";
import { codeToHtml } from "shiki";
import { getServerClient } from "@/trpc/server";
import { LeaderboardError } from "@/components/ui/leaderboard-error";
import { HomeLeaderboardRow } from "./HomeLeaderboardRow";

export const revalidate = 3600;
export const dynamic = "force-static";

interface HighlightedItem {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
  highlightedCode: string;
  roastMode: boolean;
}

async function highlightCode(code: string, language: string): Promise<string> {
  try {
    return await codeToHtml(code.trim(), {
      lang: language,
      theme: "vesper",
    });
  } catch {
    return `<pre><code>${code.trim()}</code></pre>`;
  }
}

async function getHighlightedItems(items: {
  id: string;
  score: number;
  language: string;
  code: string;
  roastMode: boolean;
}[]) {
  const highlighted = await Promise.all(
    items.map(async (item, index) => ({
      ...item,
      rank: index + 1,
      highlightedCode: await highlightCode(item.code, item.language),
    }))
  );
  return highlighted;
}

export async function HomeLeaderboardSection() {
  let data;

  try {
    const caller = await getServerClient();
    data = await caller.homePageData();
  } catch (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg font-bold text-[#FAFAFA]">
            <span className="text-[#10B981]">//</span> shame_leaderboard
          </h2>
          <Link
            href="/leaderboard"
            className="font-mono text-xs text-[#6B7280] hover:text-[#FAFAFA] hover:bg-[#2A2A2A] py-1.5 px-3 transition-colors"
          >
            view_all &gt;&gt;
          </Link>
        </div>

        <p className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
          // the worst code on the internet, ranked by shame
        </p>

        <LeaderboardError />
      </div>
    );
  }

  const items = data.leaderboard;
  const highlightedItems = await getHighlightedItems(items);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-[#FAFAFA]">
          <span className="text-[#10B981]">//</span> shame_leaderboard
        </h2>
        <Link
          href="/leaderboard"
          className="font-mono text-xs text-[#6B7280] hover:text-[#FAFAFA] hover:bg-[#2A2A2A] py-1.5 px-3 transition-colors"
        >
          view_all &gt;&gt;
        </Link>
      </div>

      <p className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
        // the worst code on the internet, ranked by shame
      </p>

      {highlightedItems.length === 0 ? (
        <div className="flex items-center justify-center rounded-md border border-[#2A2A2A] bg-[#0A0A0A] py-8">
          <span className="font-mono text-xs text-[#6B7280]">
            // no codes roasted yet. be the first!
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {highlightedItems.map((item) => (
            <HomeLeaderboardRow
              key={item.id}
              id={item.id}
              rank={item.rank}
              score={item.score}
              language={item.language}
              code={item.code}
              highlightedCode={item.highlightedCode}
              roastMode={item.roastMode}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center py-4">
        <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
          showing top 3 of {data.stats.totalSubmissions.toLocaleString('en-US')} ·{" "}
          <Link href="/leaderboard" className="hover:text-[#FAFAFA] transition-colors">
            view full leaderboard &gt;&gt;
          </Link>
        </span>
      </div>
    </div>
  );
}
