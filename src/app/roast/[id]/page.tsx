import { notFound } from "next/navigation";
import { getRoastDetails } from "@/db/queries";
import { RoastResult } from "./RoastResult";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getRoastDetails(id);

  if (!result) {
    return { title: "Roast Not Found" };
  }

  return {
    title: `Score: ${result.roast.score}/10 - ${result.roast.verdict}`,
    description: result.roast.roastQuote || "Check out this code roast!",
    openGraph: {
      title: `Score: ${result.roast.score}/10 - ${result.roast.verdict}`,
      description: result.roast.roastQuote || "Check out this code roast!",
      images: [`/api/og?id=${id}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Score: ${result.roast.score}/10 - ${result.roast.verdict}`,
      description: result.roast.roastQuote || "Check out this code roast!",
      images: [`/api/og?id=${id}`],
    },
  };
}

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
        suggestedFix: result.roast.suggestedFix ?? null,
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
