import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function checkAdminKey(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_KEY;
  if (!expected || !key) return false;
  return key === expected;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    const event = await prisma.areaEvent.update({
      where: { id: params.id },
      data: {
        status,
        resolvedAt: status === "REJECTED" ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, eventId: event.id, status: event.status });
  } catch (error) {
    console.error("PATCH /api/admin/events/[id] error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
