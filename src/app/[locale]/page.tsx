import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import Boris from "@/components/boris/Boris";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const home = messages.home as Record<string, unknown>;
  const familj = home.familj as Record<string, string>;
  const omrade = home.omrade as Record<string, string>;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐙</span>
          <span className="font-bold text-lg text-slate-800">
            {messages.common?.appName as string}
          </span>
        </div>
        <LanguageSwitcher currentLocale={locale} />
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Boris greeting */}
          <Boris locale={locale} />

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              {home.welcome as string}
            </h1>
            <p className="text-lg text-slate-500">
              {home.subtitle as string}
            </p>
          </div>

          {/* Choose path */}
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            {home.choosePath as string}
          </p>

          {/* Two cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Familj */}
            <Link
              href={`/${locale}/familj`}
              className="group relative rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100 border border-sky-200 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] hover:border-sky-300"
            >
              <div className="text-4xl mb-4">🏠</div>
              <h2 className="text-xl font-bold text-sky-900 mb-2">
                {familj.title}
              </h2>
              <p className="text-sm text-sky-700 leading-relaxed">
                {familj.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 group-hover:text-sky-800 transition-colors">
                {familj.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>

            {/* Område */}
            <Link
              href={`/${locale}/omrade`}
              className="group relative rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] hover:border-emerald-300"
            >
              {omrade.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  {omrade.badge}
                </span>
              )}
              <div className="text-4xl mb-4">🏘️</div>
              <h2 className="text-xl font-bold text-emerald-900 mb-2">
                {omrade.title}
              </h2>
              <p className="text-sm text-emerald-700 leading-relaxed">
                {omrade.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-800 transition-colors">
                {omrade.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200">
        Net Sailor Core v0.1.0 · {messages.common?.tagline as string}
      </footer>
    </main>
  );
}
