-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "flagReason" TEXT,
ADD COLUMN     "isFlagged" BOOLEAN NOT NULL DEFAULT false;
