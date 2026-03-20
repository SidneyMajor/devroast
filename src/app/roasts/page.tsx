import { getServerClient } from "@/trpc/server";
import { RoastsGallery } from "./_components/RoastsGallery";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function RoastsPage() {
  const caller = await getServerClient();
  const initialData = await caller.roastsList({ limit: 15 });

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col gap-10 px-4 py-10 md:px-8 lg:px-16">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-[#10B981]">›</span>
          <h1 className="font-mono text-[28px] font-bold text-[#FAFAFA]">roasts</h1>
        </div>
        <p className="font-mono text-[14px] text-[#6B7280]">// all the code that got roasted</p>
      </div>

      <RoastsGallery
        initialRoasts={initialData.items}
        initialCursor={initialData.nextCursor}
      />
    </div>
  );
}