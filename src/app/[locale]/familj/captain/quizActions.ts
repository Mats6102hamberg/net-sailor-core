"use server";

import { getCaptainKidIdFromSession } from "@/lib/captain/session";
import { prisma } from "@/lib/db/prisma";
import { getLessonByOrder } from "@/lib/db/lessons";
import { revalidatePath } from "next/cache";
import type { Locale } from "@/i18n/config";

export interface QuizResult {
  passed: boolean;
  score: number;
  total: number;
  nextLessonOrder?: number;
  results: {
    questionId: string;
    isCorrect: boolean;
    selectedIndex: number;
    correctIndex: number;
    explanation: string | null;
    prompt: string;
  }[];
}

export async function submitQuiz(formData: FormData): Promise<QuizResult> {
  const kidId = await getCaptainKidIdFromSession();

  if (!kidId) {
    throw new Error("Ingen Captain-session hittades");
  }

  const kid = await prisma.kid.findUnique({
    where: { id: kidId },
  });

  if (!kid) {
    throw new Error("Barnprofilen hittades inte");
  }

  if (kid.status === "REPAIR") {
    throw new Error("Reparationsläge är aktivt. Slutför reparationskursen först.");
  }

  const order = parseInt(formData.get("order") as string, 10);

  if (isNaN(order) || order < 1 || order > 5) {
    throw new Error("Ogiltig lektionsordning");
  }

  if (order !== kid.currentLessonOrder) {
    throw new Error("Du kan bara göra quizet för din aktuella lektion");
  }

  const locale = (kid.locale as Locale) || "sv";
  const lesson = await getLessonByOrder(order, locale);

  if (!lesson) {
    throw new Error("Lektion hittades inte");
  }

  const questions = lesson.questions;

  if (questions.length === 0) {
    throw new Error("Inga quizfrågor hittades för den här lektionen");
  }

  let correctCount = 0;
  const results: QuizResult["results"] = [];

  for (const question of questions) {
    const answerKey = `answer_${question.id}`;
    const selectedIndexStr = formData.get(answerKey) as string;
    const selectedIndex = parseInt(selectedIndexStr, 10);

    if (isNaN(selectedIndex)) {
      throw new Error(`Saknar svar för frågan: ${question.prompt}`);
    }

    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) {
      correctCount++;
    }

    results.push({
      questionId: question.id,
      isCorrect,
      selectedIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      prompt: question.prompt,
    });
  }

  const passed = correctCount === questions.length;
  const score = correctCount;
  const total = questions.length;
  let nextLessonOrder: number | undefined;

  await prisma.$transaction(async (tx) => {
    // Remove old attempts for these questions
    await tx.quizAttempt.deleteMany({
      where: {
        kidId: kid.id,
        questionId: { in: questions.map((q) => q.id) },
      },
    });

    // Save new attempts
    for (const result of results) {
      await tx.quizAttempt.create({
        data: {
          kidId: kid.id,
          questionId: result.questionId,
          answer: result.selectedIndex,
          correct: result.isCorrect,
        },
      });
    }

    if (passed) {
      const newLessonOrder = Math.min(kid.currentLessonOrder + 1, 6);
      nextLessonOrder = newLessonOrder;

      const updateData: { currentLessonOrder: number; status?: "UNLOCKED" } = {
        currentLessonOrder: newLessonOrder,
      };

      if (order === 5) {
        updateData.status = "UNLOCKED";
      }

      await tx.kid.update({
        where: { id: kid.id },
        data: updateData,
      });
    }
  });

  if (passed) {
    revalidatePath("/[locale]/familj/captain/home");
    revalidatePath("/[locale]/familj/guardian");
  }

  return {
    passed,
    score,
    total,
    nextLessonOrder,
    results,
  };
}
