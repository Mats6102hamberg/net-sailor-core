"use server";

import { cookies } from "next/headers";
import { createHmac } from "crypto";
import type { Locale } from "@/i18n/config";

const COOKIE_NAME = "captain_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface CaptainSessionData {
  kidId: string;
  locale: Locale;
  timestamp: number;
}

function getSecret(): string {
  const secret = process.env.CAPTAIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("CAPTAIN_SESSION_SECRET is not set in environment variables");
  }
  return secret;
}

function signData(data: string): string {
  const secret = getSecret();
  const hmac = createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}

function verifySignature(data: string, signature: string): boolean {
  const expectedSignature = signData(data);
  return signature === expectedSignature;
}

export async function setCaptainSession(kidId: string, locale: Locale): Promise<void> {
  const data = JSON.stringify({ kidId, locale, timestamp: Date.now() } as CaptainSessionData);
  const signature = signData(data);
  const cookieValue = `${Buffer.from(data).toString("base64")}.${signature}`;

  (await cookies()).set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getCaptainSession(): Promise<{ kidId: string; locale: Locale } | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  try {
    const [encodedData, signature] = cookieValue.split(".");

    if (!encodedData || !signature) {
      return null;
    }

    const data = Buffer.from(encodedData, "base64").toString("utf-8");

    if (!verifySignature(data, signature)) {
      return null;
    }

    const parsed = JSON.parse(data) as CaptainSessionData;

    if (!parsed.kidId || typeof parsed.kidId !== "string") {
      return null;
    }

    const locale = parsed.locale || "sv";

    return { kidId: parsed.kidId, locale: locale as Locale };
  } catch {
    return null;
  }
}

export async function getCaptainKidIdFromSession(): Promise<string | null> {
  const session = await getCaptainSession();
  return session?.kidId ?? null;
}

export async function clearCaptainSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
