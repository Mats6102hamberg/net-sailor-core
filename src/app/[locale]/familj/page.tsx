import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

export default async function FamiljPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const familj = messages.familj as Record<string, unknown>;
  const captain = familj.captain as Record<string, string>;
  const guardian = familj.guardian as Record<string, string>;
  const common = messages.common as Record<string, string>;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">{common.back}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏠</span>
          <span className="font-bold text-slate-800">{familj.title as string}</span>
        </div>
        <div className="w-16" />
      </header>

      {/* Content */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-slate-900">
            {familj.title as string}
          </h1>

          {/* Captain card */}
          <Link
            href={`/${locale}/familj/captain`}
            className="group block rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100 border border-sky-200 p-8 transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="text-4xl mb-3">🧒</div>
            <h2 className="text-lg font-bold text-sky-900 mb-1">
              {captain.title}
            </h2>
            <p className="text-sm text-sky-700">{captain.description}</p>
          </Link>

          {/* Guardian card */}
          <Link
            href={`/${locale}/familj/guardian`}
            className="group block rounded-2xl bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 p-8 transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="text-4xl mb-3">👨‍👩‍👧</div>
            <h2 className="text-lg font-bold text-violet-900 mb-1">
              {guardian.title}
            </h2>
            <p className="text-sm text-violet-700">{guardian.description}</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
