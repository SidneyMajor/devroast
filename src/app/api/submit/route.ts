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

    if (code.length > 2000) {
      return NextResponse.json(
        { error: "Code too long. Maximum 2,000 characters." },
        { status: 400 }
      );
    }

    const result = await submitCode(code, language, roastMode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error submitting code:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("timeout")) {
      return NextResponse.json(
        { error: "Analysis took too long. Please try again." },
        { status: 504 }
      );
    }
    if (errorMessage.includes("API key") || errorMessage.includes("auth")) {
      return NextResponse.json(
        { error: "AI service configuration error." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to analyze code. Please try again.",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
