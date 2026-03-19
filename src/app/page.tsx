import { HomeInteractive } from "./_components/HomeInteractive";
import { HomeLeaderboardSection } from "./_components/HomeLeaderboardSection";
import { StatsMetrics } from "@/components/ui/stats-metrics";
import { getServerClient } from "@/trpc/server";

export default async function Home() {
  const caller = await getServerClient();
  const [data, languages] = await Promise.all([
    caller.homePageData(),
    caller.languagesList(),
  ]);

  return (
    <>
      <HomeInteractive stats={data.stats} languages={languages} />
      <div className="flex flex-col items-center px-5">
        <div className="flex w-full max-w-[780px] flex-col gap-8">
          <StatsMetrics />
          <div className="h-[60px]" />
          <HomeLeaderboardSection />
          <div className="h-[60px]" />
        </div>
      </div>
    </>
  );
}
