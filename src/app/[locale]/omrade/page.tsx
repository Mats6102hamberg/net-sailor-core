import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import Boris from "@/components/boris/Boris";

export default async function OmradePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, string>>;
  const omrade = messages.omrade;
  const common = messages.common;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">{common.back}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏘️</span>
          <span className="font-bold text-slate-800">{omrade.title}</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <Boris locale={locale} mood="happy" />

          <h1 className="text-3xl font-extrabold text-slate-900">
            {omrade.title}
          </h1>
          <p className="text-slate-500">{omrade.description}</p>

          {/* Coming soon */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 p-8 space-y-4">
            <div className="text-5xl">🏘️</div>
            <h2 className="text-xl font-bold text-emerald-900">
              {omrade.comingSoon}
            </h2>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {omrade.comingSoonText}
            </p>
          </div>

          {/* Preview features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "📢", label: locale === "sv" ? "Händelser" : "Events" },
              { icon: "⚠️", label: locale === "sv" ? "Varningar" : "Alerts" },
              { icon: "🤝", label: locale === "sv" ? "Grannsamverkan" : "Neighbourhood Watch" },
              { icon: "💡", label: locale === "sv" ? "Tips" : "Tips" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white border border-slate-200 p-4 opacity-50"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
