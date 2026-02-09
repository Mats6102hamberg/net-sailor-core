import { locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import type { Metadata } from "next";
import AppShell from "@/components/shell/AppShell";
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dir = params.locale === "ar" ? "rtl" : "ltr";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const common = messages.common ?? {};
  const nav = messages.nav ?? {};

  return (
    <html lang={params.locale} dir={dir}>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <AppShell
          locale={locale}
          labels={{
            appName: common.appName ?? "Net Sailor",
            tagline: common.tagline ?? "",
            familj: nav.familj ?? "Familj",
            omrade: nav.omrade ?? "Område",
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
