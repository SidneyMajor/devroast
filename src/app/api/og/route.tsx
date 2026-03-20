import { ImageResponse } from "@takumi-rs/image-response";
import { getRoastDetails } from "@/db/queries";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id parameter", { status: 400 });
  }

  const result = await getRoastDetails(id);

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const { roast } = result;
  const score = Number(roast.score);

  const verdictColors = {
    critical: { dot: "#EF4444", text: "#EF4444" },
    warning: { dot: "#F59E0B", text: "#F59E0B" },
    good: { dot: "#22C55E", text: "#22C55E" },
  };

  const verdictVariant =
    score <= 2 ? "critical" : score <= 5 ? "warning" : "good";
  const colors = verdictColors[verdictVariant];

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{ color: "#22C55E", fontSize: "24px", fontWeight: 700 }}
          >{`>`}</span>
          <span style={{ color: "#FAFAFA", fontSize: "20px", fontWeight: 500 }}>
            devroast
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              color: "#F59E0B",
              fontSize: "160px",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {score.toFixed(1)}
          </span>
          <span style={{ color: "#6B7280", fontSize: "56px" }}>/10</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: colors.dot,
            }}
          />
          <span style={{ color: colors.text, fontSize: "20px" }}>
            {roast.verdict.replace(/_/g, " ")}
          </span>
        </div>

        <span style={{ color: "#6B7280", fontSize: "16px", marginBottom: "28px" }}>
          lang: {roast.language} · {roast.lineCount} lines
        </span>

        <div style={{ maxWidth: "100%", textAlign: "center" }}>
          <span style={{ color: "#FAFAFA", fontSize: "22px", lineHeight: 1.5 }}>
            "{roast.roastQuote}"
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}