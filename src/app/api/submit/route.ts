import { NextRequest, NextResponse } from "next/server";
import { submitCode } from "@/lib/roast";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language = "javascript", roastMode = true } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    if (code.length > 100000) {
      return NextResponse.json(
        { error: "Code too long. Maximum 100,000 characters." },
        { status: 400 }
      );
    }

    const result = await submitCode(code, language, roastMode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error submitting code:", error);
    return NextResponse.json(
      { error: "Failed to submit code" },
      { status: 500 }
    );
  }
}
