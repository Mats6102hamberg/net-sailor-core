/*
  Warnings:

  - The `type` column on the `AreaEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WARNING', 'INFO', 'TIP', 'NEIGHBOUR_WATCH');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "AreaEvent" ADD COLUMN     "reporterName" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "type",
ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'INFO';

-- CreateIndex
CREATE INDEX "AreaEvent_createdAt_idx" ON "AreaEvent"("createdAt");
