import { Locale, defaultLocale } from "./config";

type Messages = Record<string, unknown>;

const messageCache: Partial<Record<Locale, Messages>> = {};

async function loadMessages(locale: Locale): Promise<Messages> {
  if (messageCache[locale]) return messageCache[locale]!;

  try {
    const messages = (await import(`./locales/${locale}.json`)).default;
    messageCache[locale] = messages;
    return messages;
  } catch {
    if (locale !== defaultLocale) {
      return loadMessages(defaultLocale);
    }
    return {};
  }
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : path;
}

export async function t(locale: Locale, key: string): Promise<string> {
  const messages = await loadMessages(locale);
  return getNestedValue(messages, key);
}

export async function getMessages(locale: Locale): Promise<Messages> {
  return loadMessages(locale);
}
