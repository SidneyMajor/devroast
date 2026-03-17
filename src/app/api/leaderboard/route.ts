import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const clampedLimit = Math.min(Math.max(limit, 1), 100);

    const leaderboard = await getLeaderboard(clampedLimit);

    return NextResponse.json(leaderboard.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
