import type { Locale } from "@/i18n/config";
import { prisma } from "./prisma";

export interface LessonWithTranslation {
  id: string;
  order: number;
  title: string;
  summary: string | null;
  contentMd: string;
  locale: Locale;
}

export interface QuizQuestionWithTranslation {
  id: string;
  order: number;
  correctIndex: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  explanation: string | null;
}

export async function getLesson(
  order: number,
  locale: Locale
): Promise<LessonWithTranslation | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { order },
    include: {
      translations: {
        where: {
          OR: [{ locale }, { locale: "sv" }],
        },
      },
    },
  });

  if (!lesson || lesson.translations.length === 0) {
    return null;
  }

  const preferredTranslation = lesson.translations.find((t) => t.locale === locale);
  const fallbackTranslation = lesson.translations.find((t) => t.locale === "sv");
  const translation = preferredTranslation || fallbackTranslation!;

  return {
    id: lesson.id,
    order: lesson.order,
    title: translation.title,
    summary: translation.summary,
    contentMd: translation.contentMd,
    locale: translation.locale as Locale,
  };
}

export async function getAllLessons(locale: Locale): Promise<LessonWithTranslation[]> {
  const lessons = await prisma.lesson.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: {
        where: {
          OR: [{ locale }, { locale: "sv" }],
        },
      },
    },
  });

  return lessons
    .map((lesson) => {
      if (lesson.translations.length === 0) return null;

      const preferredTranslation = lesson.translations.find((t) => t.locale === locale);
      const fallbackTranslation = lesson.translations.find((t) => t.locale === "sv");
      const translation = preferredTranslation || fallbackTranslation!;

      return {
        id: lesson.id,
        order: lesson.order,
        title: translation.title,
        summary: translation.summary,
        contentMd: translation.contentMd,
        locale: translation.locale as Locale,
      };
    })
    .filter((lesson): lesson is LessonWithTranslation => lesson !== null);
}

export async function getQuizQuestions(
  lessonId: string,
  locale: Locale
): Promise<QuizQuestionWithTranslation[]> {
  const questions = await prisma.quizQuestion.findMany({
    where: { lessonId },
    orderBy: { order: "asc" },
    include: {
      translations: {
        where: {
          OR: [{ locale }, { locale: "sv" }],
        },
      },
    },
  });

  return questions
    .map((question) => {
      if (question.translations.length === 0) return null;

      const preferredTranslation = question.translations.find((t) => t.locale === locale);
      const fallbackTranslation = question.translations.find((t) => t.locale === "sv");
      const translation = preferredTranslation || fallbackTranslation!;

      return {
        id: question.id,
        order: question.order,
        correctIndex: question.correctIndex,
        prompt: translation.prompt,
        optionA: translation.optionA,
        optionB: translation.optionB,
        optionC: translation.optionC,
        optionD: translation.optionD,
        explanation: translation.explanation,
      };
    })
    .filter((question): question is QuizQuestionWithTranslation => question !== null);
}

export async function getLessonByOrder(
  order: number,
  locale: Locale
): Promise<(LessonWithTranslation & { questions: QuizQuestionWithTranslation[] }) | null> {
  const lesson = await getLesson(order, locale);
  if (!lesson) return null;

  const questions = await getQuizQuestions(lesson.id, locale);

  return {
    ...lesson,
    questions,
  };
}
