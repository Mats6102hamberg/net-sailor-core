-- AlterTable: Kid – add locale, change default status, update FK
ALTER TABLE "Kid" ADD COLUMN IF NOT EXISTS "locale" "Locale" NOT NULL DEFAULT 'sv';
ALTER TABLE "Kid" ALTER COLUMN "status" SET DEFAULT 'LOCKED';
ALTER TABLE "Kid" DROP CONSTRAINT IF EXISTS "Kid_guardianId_fkey";
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: LessonTranslation – summary optional, add timestamps, update FK, add index
ALTER TABLE "LessonTranslation" ALTER COLUMN "summary" DROP NOT NULL;
ALTER TABLE "LessonTranslation" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "LessonTranslation" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "LessonTranslation" DROP CONSTRAINT IF EXISTS "LessonTranslation_lessonId_fkey";
ALTER TABLE "LessonTranslation" ADD CONSTRAINT "LessonTranslation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "LessonTranslation_lessonId_idx" ON "LessonTranslation"("lessonId");

-- CreateTable: QuizQuestion
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable: QuizQuestionTranslation
CREATE TABLE "QuizQuestionTranslation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "prompt" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizQuestionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable: QuizAttempt
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "kidId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "QuizQuestion_lessonId_order_key" ON "QuizQuestion"("lessonId", "order");
CREATE INDEX "QuizQuestion_lessonId_idx" ON "QuizQuestion"("lessonId");
CREATE UNIQUE INDEX "QuizQuestionTranslation_questionId_locale_key" ON "QuizQuestionTranslation"("questionId", "locale");
CREATE INDEX "QuizQuestionTranslation_questionId_idx" ON "QuizQuestionTranslation"("questionId");
CREATE INDEX "QuizAttempt_kidId_idx" ON "QuizAttempt"("kidId");
CREATE INDEX "QuizAttempt_questionId_idx" ON "QuizAttempt"("questionId");

-- AddForeignKeys
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizQuestionTranslation" ADD CONSTRAINT "QuizQuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
