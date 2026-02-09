import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { listKidsForCaptain } from "./actions";
import { CaptainLoginForm } from "@/components/captain/CaptainLoginForm";
import Boris from "@/components/boris/Boris";

export const dynamic = "force-dynamic";

export default async function CaptainPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const common = messages.common as Record<string, string>;
  const captain = (messages.captain ?? {}) as Record<string, unknown>;
  const login = (captain.login ?? {}) as Record<string, string>;

  let kids: { id: string; name: string }[] = [];
  let error: string | null = null;

  try {
    kids = await listKidsForCaptain();
  } catch (e) {
    console.error("Failed to load kids:", e);
    error = locale === "sv"
      ? "Kunde inte ladda profiler just nu. Försök igen senare."
      : "Could not load profiles right now. Please try again later.";
  }

  const labels = {
    chooseProfile: login.chooseProfile ?? (locale === "sv" ? "Välj din profil" : "Choose your profile"),
    selectName: login.selectName ?? (locale === "sv" ? "Välj ditt namn..." : "Select your name..."),
    enterPin: login.enterPin ?? (locale === "sv" ? "Ange din hemliga PIN" : "Enter your secret PIN"),
    pinHelp: login.pinHelp ?? (locale === "sv" ? "Ange din 4-siffriga PIN (fråga din förälder om du glömt den)" : "Enter your 4-digit PIN (ask your parent if you forgot it)"),
    loggingIn: login.loggingIn ?? (locale === "sv" ? "Loggar in..." : "Logging in..."),
    setSail: login.setSail ?? (locale === "sv" ? "Sätt segel!" : "Set Sail!"),
    pinSecure: login.pinSecure ?? (locale === "sv" ? "Din PIN är säker. Vi delar den aldrig med någon." : "Your PIN is safe. We never share it with anyone."),
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
          <span className="text-xl">{"\u{1F9D2}"}</span>
          <span className="font-bold text-slate-800">Captain</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <Boris locale={locale} mood="encourage" />

          <h1 className="text-3xl font-extrabold text-center text-slate-900">
            Captain Mode
          </h1>

          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : kids.length === 0 ? (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-amber-700 text-sm">
                {locale === "sv"
                  ? "Inga barnprofiler hittades. Be din förälder att skapa en profil."
                  : "No kid profiles found. Ask your parent to create a profile."}
              </p>
            </div>
          ) : (
            <CaptainLoginForm kids={kids} locale={locale} labels={labels} />
          )}
        </div>
      </section>
    </main>
  );
}
