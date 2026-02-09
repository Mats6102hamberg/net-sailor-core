import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { GuardianPanel } from "@/components/guardian/GuardianPanel";

export default async function GuardianPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const common = messages.common as Record<string, string>;
  const guardian = ((messages.guardian ?? {}) as Record<string, string>);

  const labels = {
    title: guardian.title ?? (locale === "sv" ? "Guardian Dashboard" : "Guardian Dashboard"),
    adminKey: guardian.adminKey ?? (locale === "sv" ? "Admin-nyckel" : "Admin key"),
    adminKeyPlaceholder: guardian.adminKeyPlaceholder ?? (locale === "sv" ? "Ange admin-nyckel..." : "Enter admin key..."),
    load: guardian.load ?? (locale === "sv" ? "Logga in" : "Log in"),
    unauthorized: guardian.unauthorized ?? (locale === "sv" ? "Fel nyckel." : "Wrong key."),
    noKids: guardian.noKids ?? (locale === "sv" ? "Inga barn registrerade." : "No kids registered."),
    status: guardian.status ?? "Status",
    progress: guardian.progress ?? (locale === "sv" ? "Progress" : "Progress"),
    reset: guardian.reset ?? (locale === "sv" ? "Återställ" : "Reset"),
    createKid: guardian.createKid ?? (locale === "sv" ? "Skapa barn" : "Create kid"),
    name: guardian.name ?? (locale === "sv" ? "Namn" : "Name"),
    pin: guardian.pin ?? "PIN",
    guardian: guardian.guardian ?? "Guardian",
    save: guardian.save ?? (locale === "sv" ? "Spara" : "Save"),
    locked: guardian.locked ?? (locale === "sv" ? "Låst" : "Locked"),
    unlocked: guardian.unlocked ?? (locale === "sv" ? "Upplåst" : "Unlocked"),
    repair: guardian.repair ?? (locale === "sv" ? "Reparation" : "Repair"),
    lessonOf: guardian.lessonOf ?? (locale === "sv" ? "Lektion {current} av {total}" : "Lesson {current} of {total}"),
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}/familj`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>&larr;</span>
          <span className="text-sm font-medium">{common.back}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">{"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}"}</span>
          <span className="font-bold text-slate-800">Guardian</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-8">
            {labels.title}
          </h1>
          <GuardianPanel locale={locale} labels={labels} />
        </div>
      </section>
    </main>
  );
}
