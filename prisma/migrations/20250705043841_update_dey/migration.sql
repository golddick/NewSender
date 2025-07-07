/*
  Warnings:

  - You are about to drop the column `formId` on the `Subscriber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscriber" DROP CONSTRAINT "Subscriber_campaignId_fkey";

-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "formId",
ALTER COLUMN "campaignId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
