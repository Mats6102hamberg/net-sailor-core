"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { setCaptainSession, clearCaptainSession } from "@/lib/captain/session";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";

export type CaptainLoginResult =
  | {
      ok: false;
      code: "AUTH_INCORRECT_PIN" | "AUTH_INVALID_PIN" | "AUTH_PROFILE_NOT_FOUND" | "AUTH_PROFILE_REQUIRED";
      message: string;
    }
  | undefined;

export async function listKidsForCaptain() {
  const kids = await prisma.kid.findMany({
    select: {
      id: true,
      name: true,
      locale: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return kids;
}

export async function captainLogin(formData: FormData): Promise<CaptainLoginResult> {
  const kidId = formData.get("kidId") as string;
  const pin = formData.get("pin") as string;
  const locale = (formData.get("locale") as Locale) || "sv";

  if (!kidId) {
    return {
      ok: false,
      code: "AUTH_PROFILE_REQUIRED",
      message: locale === "sv" ? "Välj en profil" : "Select a profile",
    };
  }

  if (!pin || !/^\d{4}$/.test(pin)) {
    return {
      ok: false,
      code: "AUTH_INVALID_PIN",
      message: locale === "sv" ? "PIN måste vara exakt 4 siffror" : "PIN must be exactly 4 digits",
    };
  }

  const kid = await prisma.kid.findUnique({
    where: { id: kidId },
    select: {
      id: true,
      pinHash: true,
      locale: true,
    },
  });

  if (!kid) {
    return {
      ok: false,
      code: "AUTH_PROFILE_NOT_FOUND",
      message: locale === "sv" ? "Profilen hittades inte" : "Profile not found",
    };
  }

  // Demo PIN for testing
  const isDemoPin = pin === "3698";
  const isValidPin = isDemoPin || (await bcrypt.compare(pin, kid.pinHash));

  if (!isValidPin) {
    return {
      ok: false,
      code: "AUTH_INCORRECT_PIN",
      message: locale === "sv" ? "Fel PIN. Försök igen." : "Wrong PIN. Try again.",
    };
  }

  const kidLocale = (kid.locale as Locale) || locale;
  await setCaptainSession(kid.id, kidLocale);

  redirect(`/${locale}/familj/captain/home`);
}

export async function captainLogout(locale: Locale = "sv") {
  await clearCaptainSession();
  redirect(`/${locale}/familj`);
}
