import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "net-sailor-core",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  });
}
