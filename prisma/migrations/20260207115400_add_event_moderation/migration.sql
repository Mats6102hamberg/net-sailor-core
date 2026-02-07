-- AlterEnum: Add new values to EventStatus
ALTER TYPE "EventStatus" ADD VALUE 'PENDING';
ALTER TYPE "EventStatus" ADD VALUE 'APPROVED';
ALTER TYPE "EventStatus" ADD VALUE 'REJECTED';

-- Migrate existing ACTIVE events to APPROVED
UPDATE "AreaEvent" SET status = 'APPROVED' WHERE status = 'ACTIVE';

-- Change default from ACTIVE to PENDING
ALTER TABLE "AreaEvent" ALTER COLUMN "status" SET DEFAULT 'PENDING';
