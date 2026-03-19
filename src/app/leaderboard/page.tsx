import { getServerClient } from "@/trpc/server";
import { LeaderboardClient } from "./_components/LeaderboardClient";
import { LeaderboardError } from "@/components/ui/leaderboard-error";

export const revalidate = 3600;
export const dynamic = "force-static";

export default async function LeaderboardPage() {
  let data;

  try {
    const caller = await getServerClient();
    data = await caller.leaderboardFull();
  } catch (error) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col gap-10 px-20 py-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[32px] font-bold text-[#22C55E]">›</span>
            <h1 className="font-mono text-[28px] font-bold text-[#FAFAFA]">shame_leaderboard</h1>
          </div>
          <p className="font-mono text-[14px] text-[#6B7280]">// the most roasted code on the internet</p>
        </div>

        <LeaderboardError />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col gap-10 px-20 py-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-[#22C55E]">›</span>
          <h1 className="font-mono text-[28px] font-bold text-[#FAFAFA]">shame_leaderboard</h1>
        </div>
        <p className="font-mono text-[14px] text-[#6B7280]">// the most roasted code on the internet</p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-[#4B5563]">{data.items.length} submissions</span>
          <span className="text-[12px] text-[#4B5563]">·</span>
          <span className="font-mono text-[12px] text-[#4B5563]">avg score: 4.2/10</span>
        </div>
      </div>

      <LeaderboardClient items={data.items} />
    </div>
  );
}
