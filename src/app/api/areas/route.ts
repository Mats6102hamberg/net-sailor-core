import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { events: true } },
      },
    });
    return NextResponse.json(areas);
  } catch (error) {
    console.error("GET /api/areas error:", error);
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, lat, lng } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const area = await prisma.area.create({
      data: { name, slug, lat: lat ?? null, lng: lng ?? null },
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error("POST /api/areas error:", error);
    return NextResponse.json({ error: "Failed to create area" }, { status: 500 });
  }
}
