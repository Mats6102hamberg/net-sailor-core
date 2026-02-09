import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { BorisButton } from "@/components/boris/BorisButton";

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
  const boris = messages.boris as Record<string, string>;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        <BorisButton
          context="family"
          greeting={boris.greeting}
          message={boris.intro}
          tip={boris.tip}
        />

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {home.welcome as string}
          </h1>
          <p className="text-lg text-slate-500">
            {home.subtitle as string}
          </p>
        </div>

        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          {home.choosePath as string}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href={`/${locale}/familj`}
            className="group relative rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100 border border-sky-200 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] hover:border-sky-300"
          >
            <div className="text-4xl mb-4">{"\u{1F3E0}"}</div>
            <h2 className="text-xl font-bold text-sky-900 mb-2">
              {familj.title}
            </h2>
            <p className="text-sm text-sky-700 leading-relaxed">
              {familj.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 group-hover:text-sky-800 transition-colors">
              {familj.cta}
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </div>
          </Link>

          <Link
            href={`/${locale}/omrade`}
            className="group relative rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] hover:border-emerald-300"
          >
            {omrade.badge && (
              <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                {omrade.badge}
              </span>
            )}
            <div className="text-4xl mb-4">{"\u{1F3D8}\u{FE0F}"}</div>
            <h2 className="text-xl font-bold text-emerald-900 mb-2">
              {omrade.title}
            </h2>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {omrade.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-800 transition-colors">
              {omrade.cta}
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
