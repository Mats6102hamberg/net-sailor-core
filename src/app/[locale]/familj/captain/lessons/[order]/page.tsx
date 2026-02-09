import { redirect } from "next/navigation";
import { getCaptainKidIdFromSession } from "@/lib/captain/session";
import { prisma } from "@/lib/db/prisma";
import { getLessonByOrder } from "@/lib/db/lessons";
import { MarkdownRenderer } from "@/components/captain/MarkdownRenderer";
import { BorisCoach } from "@/components/captain/BorisCoach";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function CaptainLessonPage({
  params,
}: {
  params: { locale: string; order: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const captain = (messages.captain ?? {}) as Record<string, unknown>;
  const lessonLabels = (captain.lesson ?? {}) as Record<string, string>;
  const boris = (captain.boris ?? {}) as Record<string, string>;

  const kidId = await getCaptainKidIdFromSession();

  if (!kidId) {
    redirect(`/${locale}/familj/captain`);
  }

  const kid = await prisma.kid.findUnique({
    where: { id: kidId },
    select: { id: true, name: true, status: true, currentLessonOrder: true, locale: true },
  });

  if (!kid) {
    redirect(`/${locale}/familj/captain`);
  }

  const orderNum = parseInt(params.order, 10);

  if (isNaN(orderNum) || orderNum < 1 || orderNum > 5) {
    redirect(`/${locale}/familj/captain/home`);
  }

  if (orderNum !== kid.currentLessonOrder) {
    redirect(`/${locale}/familj/captain/home`);
  }

  const kidLocale = (kid.locale as Locale) || locale;
  const lesson = await getLessonByOrder(orderNum, kidLocale);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 mb-4">
              {locale === "sv" ? "Lektion hittades inte" : "Lesson not found"}
            </p>
            <Link
              href={`/${locale}/familj/captain/home`}
              className="inline-block px-4 py-2 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
            >
              {locale === "sv" ? "Till startsidan" : "Back to home"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalLessons = 5;
  const completedLessons = Math.max(0, Math.min(orderNum - 1, totalLessons));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/familj/captain/home`}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>&larr;</span>
              <span className="text-sm">{locale === "sv" ? "Tillbaka" : "Back"}</span>
            </Link>
            <div className="flex items-center gap-2">
              <span>{"\u{1F4D6}"}</span>
              <span className="font-bold text-slate-800">
                {lessonLabels.lessonOf?.replace("{current}", String(orderNum)).replace("{total}", String(totalLessons)) ??
                  `${locale === "sv" ? "Lektion" : "Lesson"} ${orderNum}/${totalLessons}`}
              </span>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">{lesson.title}</h2>
          {lesson.summary && (
            <p className="text-lg text-slate-600 leading-relaxed mb-6">{lesson.summary}</p>
          )}
          <div className="border-t border-slate-200 pt-6">
            <MarkdownRenderer content={lesson.contentMd} />
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/familj/captain/home`}
              className="px-4 py-2 text-sky-700 font-medium hover:text-sky-800 transition-colors"
            >
              &larr; {locale === "sv" ? "Tillbaka" : "Back"}
            </Link>
            <Link
              href={`/${locale}/familj/captain/lessons/${orderNum}/quiz`}
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              {lessonLabels.takeQuiz ?? (locale === "sv" ? "Gör quiz" : "Take Quiz")} &rarr;
            </Link>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            {lessonLabels.quizHint ?? (locale === "sv" ? "Klara quizet för att låsa upp nästa lektion" : "Complete the quiz to unlock the next lesson")}
          </p>
        </div>

        <div className="mt-6">
          <BorisCoach
            completed={completedLessons}
            total={totalLessons}
            labels={{
              title: boris.title ?? "Boris",
              message: boris.progress ?? (locale === "sv" ? "Bra jobbat hittills!" : "Great job so far!"),
              tip: boris.tip,
            }}
          />
        </div>
      </main>
    </div>
  );
}
