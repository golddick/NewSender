-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "failedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "successfulPayments" INTEGER NOT NULL DEFAULT 0;
