import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const area = await prisma.area.findUnique({
      where: { slug: params.slug },
      include: {
        events: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    return NextResponse.json({ area, events: area.events });
  } catch (error) {
    console.error("GET /api/areas/[slug]/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const area = await prisma.area.findUnique({
      where: { slug: params.slug },
    });

    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, type, severity, reporterName } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const validTypes = ["WARNING", "INFO", "TIP", "NEIGHBOUR_WATCH"];
    const eventType = validTypes.includes(type) ? type : "INFO";
    const eventSeverity = Math.min(Math.max(Number(severity) || 1, 1), 3);

    const event = await prisma.areaEvent.create({
      data: {
        areaId: area.id,
        title,
        description: description ?? null,
        type: eventType,
        severity: eventSeverity,
        reporterName: reporterName ?? null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, status: "PENDING", eventId: event.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/areas/[slug]/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
