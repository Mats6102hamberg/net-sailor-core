import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import Boris from "@/components/boris/Boris";

export default async function CaptainPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, string>>;
  const common = messages.common;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}/familj`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">{common.back}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🧒</span>
          <span className="font-bold text-slate-800">Captain</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <Boris locale={locale} mood="happy" />
          <h1 className="text-3xl font-extrabold text-slate-900">
            Captain Mode
          </h1>
          <p className="text-slate-500">
            {locale === "sv"
              ? "Här kommer dina lektioner och uppdrag att finnas. Boris guidar dig!"
              : "Your lessons and missions will be here. Boris will guide you!"}
          </p>
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-6">
            <p className="text-sky-700 text-sm font-medium">
              {locale === "sv" ? "🚧 Kommer snart – steg 2" : "🚧 Coming soon – step 2"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
