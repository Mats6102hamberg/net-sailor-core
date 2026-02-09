import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { BorisButton } from "@/components/boris/BorisButton";

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
  const boris = messages.boris as Record<string, string>;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        <BorisButton
          context="family"
          greeting={boris.greeting}
          message={boris.intro}
        />

        <h1 className="text-3xl font-extrabold text-center text-slate-900">
          {familj.title as string}
        </h1>

        <Link
          href={`/${locale}/familj/captain`}
          className="group block rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100 border border-sky-200 p-8 transition-all hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="text-4xl mb-3">{"\u{1F9D2}"}</div>
          <h2 className="text-lg font-bold text-sky-900 mb-1">
            {captain.title}
          </h2>
          <p className="text-sm text-sky-700">{captain.description}</p>
        </Link>

        <Link
          href={`/${locale}/familj/guardian`}
          className="group block rounded-2xl bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 p-8 transition-all hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="text-4xl mb-3">{"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}"}</div>
          <h2 className="text-lg font-bold text-violet-900 mb-1">
            {guardian.title}
          </h2>
          <p className="text-sm text-violet-700">{guardian.description}</p>
        </Link>
      </div>
    </main>
  );
}
