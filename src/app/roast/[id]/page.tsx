import { notFound } from "next/navigation";
import { getRoastDetails } from "@/db/queries";
import { RoastResult } from "./RoastResult";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await getRoastDetails(id);

  if (!result) {
    notFound();
  }

  return (
    <RoastResult
      roast={{
        id: result.roast.id,
        code: result.roast.code,
        language: result.roast.language,
        score: Number(result.roast.score),
        verdict: result.roast.verdict,
        roastQuote: result.roast.roastQuote || "",
        lineCount: result.roast.lineCount,
        roastMode: result.roast.roastMode,
      }}
      analysisItems={result.analysisItems.map((item) => ({
        id: item.id,
        severity: item.severity,
        title: item.title,
        description: item.description,
        order: item.order,
      }))}
    />
  );
}
