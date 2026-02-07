import { NextRequest, NextResponse } from "next/server";
import { routeAIRequest } from "@/ai/router";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context, locale } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt' field" },
        { status: 400 }
      );
    }

    const response = await routeAIRequest({
      prompt,
      context,
      locale: locale ?? "sv",
      provider: "stub",
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API][AI][ASK] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/ai/ask",
    method: "POST",
    description: "Boris AI endpoint – skicka { prompt, locale? } för att prata med Boris",
  });
}
