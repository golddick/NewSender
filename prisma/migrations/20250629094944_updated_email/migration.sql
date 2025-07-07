/*
  Warnings:

  - Added the required column `emailType` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleType` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('immediate', 'scheduled', 'draft');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('automated', 'instant');

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "emailType" TEXT NOT NULL,
ADD COLUMN     "enableUnsubscribe" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scheduleDate" TIMESTAMP(3),
ADD COLUMN     "scheduleTime" TEXT,
ADD COLUMN     "scheduleType" TEXT NOT NULL,
ADD COLUMN     "trackClicks" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "trackOpens" BOOLEAN NOT NULL DEFAULT true;
