/*
  Warnings:

  - The `recipient` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "recipient",
ADD COLUMN     "recipient" INTEGER NOT NULL DEFAULT 0;
