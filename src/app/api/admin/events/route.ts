import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function checkAdminKey(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_KEY;
  if (!expected || !key) return false;
  return key === expected;
}

export async function GET(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "RESOLVED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const events = await prisma.areaEvent.findMany({
      where: { status: status as "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED" | "ARCHIVED" },
      orderBy: { createdAt: "desc" },
      include: { area: { select: { name: true, slug: true } } },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
