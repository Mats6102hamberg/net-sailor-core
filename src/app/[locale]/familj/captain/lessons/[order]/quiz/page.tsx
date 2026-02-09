import { redirect } from "next/navigation";
import { getCaptainKidIdFromSession } from "@/lib/captain/session";
import { prisma } from "@/lib/db/prisma";
import { getLessonByOrder } from "@/lib/db/lessons";
import { QuizForm } from "@/components/captain/QuizForm";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function CaptainQuizPage({
  params,
}: {
  params: { locale: string; order: string };
}) {
  const locale = params.locale as Locale;
  const messages = (await getMessages(locale)) as Record<string, Record<string, unknown>>;
  const captain = (messages.captain ?? {}) as Record<string, unknown>;
  const quiz = (captain.quiz ?? {}) as Record<string, string>;
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

  if (!lesson || lesson.questions.length === 0) {
    return (
      <main className="flex-1 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-800 mb-4">
              {locale === "sv" ? "Inget quiz tillgängligt för denna lektion." : "No quiz available for this lesson."}
            </p>
            <Link
              href={`/${locale}/familj/captain/home`}
              className="inline-block px-4 py-2 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
            >
              {locale === "sv" ? "Tillbaka" : "Back"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const labels = {
    submit: quiz.submit ?? (locale === "sv" ? "Skicka svar" : "Submit Answers"),
    submitting: quiz.submitting ?? (locale === "sv" ? "Skickar..." : "Submitting..."),
    passed: quiz.passed ?? (locale === "sv" ? "Utmärkt!" : "Excellent!"),
    failed: quiz.failed ?? (locale === "sv" ? "Inte riktigt" : "Not Quite"),
    score: quiz.score ?? (locale === "sv" ? "{score} av {total} rätt" : "{score} of {total} correct"),
    unlocked: quiz.unlocked ?? (locale === "sv" ? "Du har låst upp lektion {lesson}!" : "You unlocked lesson {lesson}!"),
    allDone: quiz.allDone ?? (locale === "sv" ? "Du har klarat alla lektioner!" : "You completed all lessons!"),
    reviewNeeded: quiz.reviewNeeded ?? (locale === "sv" ? "Du behöver 100% rätt. Granska svaren nedan och försök igen." : "You need 100% to pass. Review the answers and try again."),
    reviewTitle: quiz.reviewTitle ?? (locale === "sv" ? "Granska dina svar" : "Review Your Answers"),
    yourAnswer: quiz.yourAnswer ?? (locale === "sv" ? "Ditt svar" : "Your answer"),
    correctAnswer: quiz.correctAnswer ?? (locale === "sv" ? "Rätt svar" : "Correct answer"),
    explanation: quiz.explanation ?? (locale === "sv" ? "Förklaring" : "Explanation"),
    tryAgain: quiz.tryAgain ?? (locale === "sv" ? "Försök igen" : "Try Again"),
    continue: quiz.continue ?? (locale === "sv" ? "Fortsätt" : "Continue"),
    questionOf: quiz.questionOf ?? (locale === "sv" ? "Fråga {current} av {total}" : "Question {current} of {total}"),
    borisTitle: boris.title ?? "Boris",
    borisPass: boris.quizPass ?? (locale === "sv" ? "Snyggt jobbat!" : "Nice work!"),
    borisFail: boris.quizFail ?? (locale === "sv" ? "Inga problem \u2013 alla lär sig!" : "No worries \u2013 everyone learns!"),
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${locale}/familj/captain/lessons/${orderNum}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>&larr;</span>
            <span className="text-sm">{locale === "sv" ? "Till lektionen" : "Back to lesson"}</span>
          </Link>
          <span className="font-bold text-slate-800">
            Quiz {locale === "sv" ? "lektion" : "lesson"} {orderNum}
          </span>
          <div className="w-16" />
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{"\u{1F3AF}"}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {quiz.title ?? (locale === "sv" ? "Testa dina kunskaper!" : "Test Your Knowledge!")}
              </h2>
              <p className="text-slate-700 mb-2">
                {quiz.instruction ?? (locale === "sv"
                  ? "Svara rätt på alla frågor för att låsa upp nästa lektion."
                  : "Answer all questions correctly to unlock the next lesson.")}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-white rounded-lg border border-sky-300 font-medium">
                  {lesson.questions.length} {locale === "sv" ? "frågor" : "questions"}
                </span>
                <span className="px-2 py-1 bg-white rounded-lg border border-sky-300 font-medium">
                  100% {locale === "sv" ? "krävs" : "required"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <QuizForm
          questions={lesson.questions}
          lessonOrder={orderNum}
          locale={locale}
          labels={labels}
        />
      </div>
    </main>
  );
}
