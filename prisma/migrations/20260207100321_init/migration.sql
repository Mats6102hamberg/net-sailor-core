-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('sv', 'en');

-- CreateEnum
CREATE TYPE "KidStatus" AS ENUM ('UNLOCKED', 'LOCKED', 'REPAIR');

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "email" TEXT,
    "name" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'sv',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kid" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "status" "KidStatus" NOT NULL DEFAULT 'UNLOCKED',
    "currentLessonOrder" INTEGER NOT NULL DEFAULT 1,
    "guardianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonTranslation" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contentMd" TEXT NOT NULL,

    CONSTRAINT "LessonTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaEvent" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AreaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BorisLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'sv',
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stub',
    "mood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BorisLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_clerkId_key" ON "Guardian"("clerkId");

-- CreateIndex
CREATE INDEX "Kid_guardianId_idx" ON "Kid"("guardianId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_order_key" ON "Lesson"("order");

-- CreateIndex
CREATE UNIQUE INDEX "LessonTranslation_lessonId_locale_key" ON "LessonTranslation"("lessonId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Area_slug_key" ON "Area"("slug");

-- CreateIndex
CREATE INDEX "AreaEvent_areaId_idx" ON "AreaEvent"("areaId");

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTranslation" ADD CONSTRAINT "LessonTranslation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaEvent" ADD CONSTRAINT "AreaEvent_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
