-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "clickedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];
