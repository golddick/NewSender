-- AlterEnum
ALTER TYPE "EmailType" ADD VALUE 'scheduled';

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "last_sent_at" TIMESTAMP(3);
