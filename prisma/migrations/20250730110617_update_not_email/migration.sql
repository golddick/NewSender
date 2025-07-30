-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "clickedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "openedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];
