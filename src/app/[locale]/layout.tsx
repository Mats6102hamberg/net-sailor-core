import { locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import type { Metadata } from "next";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, string>>;

  return {
    title: messages?.common?.appName ?? "Net Sailor",
    description: messages?.common?.tagline ?? "En app. Två världar. En Boris.",
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dir = params.locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={params.locale} dir={dir}>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
