"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

function verifyAdminKey(key: string): boolean {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return false;
  return key === adminKey;
}

export async function listKidsWithAdmin(adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    throw new Error("Unauthorized");
  }

  const kids = await prisma.kid.findMany({
    include: {
      guardian: {
        select: { name: true, email: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return kids.map((kid) => ({
    id: kid.id,
    name: kid.name,
    status: kid.status,
    currentLessonOrder: kid.currentLessonOrder,
    locale: kid.locale,
    guardianName: kid.guardian.name ?? kid.guardian.email ?? "Okänd",
    createdAt: kid.createdAt.toISOString(),
  }));
}

export async function createKidWithAdmin(formData: FormData) {
  const adminKey = formData.get("adminKey") as string;
  if (!verifyAdminKey(adminKey)) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const pin = formData.get("pin") as string;
  const guardianId = formData.get("guardianId") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Namn krävs");
  }

  if (!pin || !/^\d{4}$/.test(pin)) {
    throw new Error("PIN måste vara exakt 4 siffror");
  }

  if (!guardianId) {
    throw new Error("Guardian ID krävs");
  }

  const pinHash = await bcrypt.hash(pin, 10);

  const kid = await prisma.kid.create({
    data: {
      guardianId,
      name: name.trim(),
      pinHash,
      status: "LOCKED",
      currentLessonOrder: 1,
    },
  });

  revalidatePath("/[locale]/familj/guardian");

  return { id: kid.id, name: kid.name };
}

export async function setKidStatusWithAdmin(formData: FormData) {
  const adminKey = formData.get("adminKey") as string;
  if (!verifyAdminKey(adminKey)) {
    throw new Error("Unauthorized");
  }

  const kidId = formData.get("kidId") as string;
  const status = formData.get("status") as "LOCKED" | "UNLOCKED" | "REPAIR";

  if (!kidId) throw new Error("Kid ID krävs");
  if (!["LOCKED", "UNLOCKED", "REPAIR"].includes(status)) throw new Error("Ogiltig status");

  await prisma.kid.update({
    where: { id: kidId },
    data: { status },
  });

  revalidatePath("/[locale]/familj/guardian");

  return { ok: true };
}

export async function resetKidProgressWithAdmin(formData: FormData) {
  const adminKey = formData.get("adminKey") as string;
  if (!verifyAdminKey(adminKey)) {
    throw new Error("Unauthorized");
  }

  const kidId = formData.get("kidId") as string;
  if (!kidId) throw new Error("Kid ID krävs");

  await prisma.kid.update({
    where: { id: kidId },
    data: {
      currentLessonOrder: 1,
      status: "LOCKED",
    },
  });

  revalidatePath("/[locale]/familj/guardian");

  return { ok: true };
}

export async function listGuardians(adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    throw new Error("Unauthorized");
  }

  const guardians = await prisma.guardian.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return guardians;
}
