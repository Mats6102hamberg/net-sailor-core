import { redirect } from "next/navigation";
import { getCaptainKidIdFromSession } from "@/lib/captain/session";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { BorisButton } from "@/components/boris/BorisButton";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

export const dynamic = "force-dynamic";

const TOTAL_LESSONS = 5;

export default async function CaptainHomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const captain = (messages.captain ?? {}) as Record<string, unknown>;
  const home = (captain.home ?? {}) as Record<string, string>;
  const boris = (captain.boris ?? {}) as Record<string, string>;

  const kidId = await getCaptainKidIdFromSession();

  if (!kidId) {
    redirect(`/${locale}/familj/captain`);
  }

  const kid = await prisma.kid.findUnique({
    where: { id: kidId },
    select: { id: true, name: true, currentLessonOrder: true, locale: true },
  });

  if (!kid) {
    redirect(`/${locale}/familj/captain`);
  }

  const completedLessons = Math.max(0, Math.min(kid.currentLessonOrder - 1, TOTAL_LESSONS));
  const allDone = kid.currentLessonOrder >= 6;

  const ctaHref = allDone
    ? `/${locale}/familj/captain/home`
    : `/${locale}/familj/captain/lessons/${kid.currentLessonOrder}`;

  const ctaLabel = allDone
    ? (home.allDone ?? (locale === "sv" ? "Du är klar!" : "You're done!"))
    : kid.currentLessonOrder === 1
      ? (home.startFirst ?? (locale === "sv" ? "Starta första uppdraget" : "Start first mission"))
      : (home.continueLesson ?? (locale === "sv" ? `Starta lektion ${kid.currentLessonOrder}` : `Start lesson ${kid.currentLessonOrder}`));

  const introText = allDone
    ? (home.completedIntro ?? (locale === "sv" ? "Alla uppdrag klara! Bra jobbat!" : "All missions complete! Great job!"))
    : kid.currentLessonOrder >= 2
      ? (home.continueIntro ?? (locale === "sv" ? "Fortsätt där du slutade." : "Continue where you left off."))
      : (home.startIntro ?? (locale === "sv" ? "Du är redo att börja ditt första uppdrag." : "You're ready to start your first mission."));

  const borisMessage = allDone
    ? (boris.done ?? (locale === "sv" ? "Fantastiskt! Du har klarat alla uppdrag!" : "Amazing! You completed all missions!"))
    : completedLessons === 0
      ? (boris.start ?? (locale === "sv" ? "Hej! Jag är Boris, din digitala kompis. Redo att börja?" : "Hi! I'm Boris, your digital buddy. Ready to start?"))
      : completedLessons >= 4
        ? (boris.almostDone ?? (locale === "sv" ? "Wow, nästan klart! Sista uppdraget väntar!" : "Wow, almost done! Last mission awaits!"))
        : (boris.progress ?? (locale === "sv" ? "Bra jobbat hittills! Fortsätt så!" : "Great job so far! Keep going!"));

  return (
    <main className="flex-1 bg-gradient-to-b from-sky-50 to-white flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="text-6xl mb-6">{"\u{1F9ED}"}</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {(home.greeting ?? (locale === "sv" ? "Hej" : "Hi"))} {kid.name}!
        </h1>
        <p className="text-slate-600 mb-8">{introText}</p>

        <div className="mb-6">
          <p className="text-sm text-slate-500">
            {completedLessons} {locale === "sv" ? "av" : "of"} {TOTAL_LESSONS} {locale === "sv" ? "uppdrag klara" : "missions complete"}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_LESSONS }).map((_, index) => {
              const isComplete = index < completedLessons;
              return (
                <span
                  key={`progress-dot-${index + 1}`}
                  className={`h-2.5 w-2.5 rounded-full border ${
                    isComplete
                      ? "bg-sky-600 border-sky-700"
                      : "bg-white border-slate-300"
                  }`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </div>

        <div className="mb-6 text-left">
          <BorisButton
            context="family"
            greeting={boris.title ?? "Boris"}
            message={borisMessage}
            tip={boris.tip}
          />
        </div>

        {!allDone && (
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center w-full px-6 py-4 bg-sky-600 text-white rounded-xl font-semibold text-lg hover:bg-sky-700 transition-colors"
          >
            {ctaLabel}
          </Link>
        )}

        <div className="mt-6">
          <Link
            href={`/${locale}/familj`}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            &larr; {locale === "sv" ? "Tillbaka till Familj" : "Back to Family"}
          </Link>
        </div>
      </div>
    </main>
  );
}
