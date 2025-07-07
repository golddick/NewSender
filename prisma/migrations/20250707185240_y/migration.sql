-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "openedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];
