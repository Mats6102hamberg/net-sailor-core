"use client";

import { submitQuiz, type QuizResult } from "@/app/[locale]/familj/captain/quizActions";
import { useState, useTransition } from "react";
import Link from "next/link";
import { BorisButton } from "@/components/boris/BorisButton";

interface QuizQuestion {
  id: string;
  order: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctIndex: number;
  explanation: string | null;
}

interface QuizFormProps {
  questions: QuizQuestion[];
  lessonOrder: number;
  locale: string;
  labels: {
    submit: string;
    submitting: string;
    passed: string;
    failed: string;
    score: string;
    unlocked: string;
    allDone: string;
    reviewNeeded: string;
    reviewTitle: string;
    yourAnswer: string;
    correctAnswer: string;
    explanation: string;
    tryAgain: string;
    continue: string;
    questionOf: string;
    borisTitle: string;
    borisPass: string;
    borisFail: string;
  };
}

export function QuizForm({ questions, lessonOrder, locale, labels }: QuizFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const quizResult = await submitQuiz(formData);
        setResult(quizResult);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Kunde inte skicka quizet.");
      }
    });
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const getOptionLabel = (index: number): string => {
    return ["A", "B", "C", "D"][index];
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div
          className={`rounded-2xl border-2 p-6 ${
            result.passed ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
          }`}
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{result.passed ? "\u{1F389}" : "\u{1F614}"}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {result.passed ? labels.passed : labels.failed}
            </h2>
            <p className="text-lg text-slate-700">
              {labels.score.replace("{score}", String(result.score)).replace("{total}", String(result.total))}
            </p>
            {result.passed ? (
              <p className="text-green-700 mt-2">
                {result.nextLessonOrder && result.nextLessonOrder <= 5
                  ? labels.unlocked.replace("{lesson}", String(result.nextLessonOrder))
                  : labels.allDone}
              </p>
            ) : (
              <p className="text-red-700 mt-2">{labels.reviewNeeded}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">{labels.reviewTitle}</h3>
          {result.results.map((questionResult, idx) => (
            <div
              key={questionResult.questionId}
              className={`rounded-2xl border-2 p-6 ${
                questionResult.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{questionResult.isCorrect ? "\u2713" : "\u2717"}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-2">
                    {idx + 1}. {questionResult.prompt}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">{labels.yourAnswer}:</span>{" "}
                      <span className={questionResult.isCorrect ? "text-green-700" : "text-red-700"}>
                        {getOptionLabel(questionResult.selectedIndex)}
                      </span>
                    </p>
                    {!questionResult.isCorrect && (
                      <p>
                        <span className="font-medium">{labels.correctAnswer}:</span>{" "}
                        <span className="text-green-700">{getOptionLabel(questionResult.correctIndex)}</span>
                      </p>
                    )}
                    {questionResult.explanation && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-700">
                          <span className="font-medium">{labels.explanation}:</span> {questionResult.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <BorisButton
            context="family"
            greeting={labels.borisTitle}
            message={result.passed ? labels.borisPass : labels.borisFail}
          />
        </div>

        <div className="flex justify-center gap-4">
          {result.passed ? (
            <Link
              href={`/${locale}/familj/captain/home`}
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              {labels.continue}
            </Link>
          ) : (
            <button
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
              }}
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              {labels.tryAgain}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="order" value={lessonOrder} />

      {questions.map((question, idx) => (
        <div key={question.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {labels.questionOf.replace("{current}", String(idx + 1)).replace("{total}", String(questions.length))}
          </h3>
          <p className="text-slate-800 mb-6 text-lg leading-relaxed">{question.prompt}</p>

          <div className="space-y-3">
            {[
              { index: 0, text: question.optionA },
              { index: 1, text: question.optionB },
              { index: 2, text: question.optionC },
              { index: 3, text: question.optionD },
            ].map((option) => {
              const isSelected = selectedAnswers[question.id] === option.index;
              return (
                <label
                  key={option.index}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`answer_${question.id}`}
                    value={option.index}
                    required
                    disabled={isPending}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(question.id, option.index)}
                    className="mt-1 w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="flex-1 text-slate-800">
                    <span className="font-semibold mr-2">{getOptionLabel(option.index)}.</span>
                    {option.text}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isPending || Object.keys(selectedAnswers).length !== questions.length}
          className="px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold text-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? labels.submitting : labels.submit}
        </button>
      </div>
    </form>
  );
}
