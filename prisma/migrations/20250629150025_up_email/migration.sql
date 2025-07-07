/*
  Warnings:

  - You are about to drop the column `sentCount` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "EmailStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "sentCount",
ADD COLUMN     "emailsSent" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "messageId" TEXT;
