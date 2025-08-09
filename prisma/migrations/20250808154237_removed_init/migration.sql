/*
  Warnings:

  - You are about to drop the column `integrationId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `trigger` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `integrationId` on the `NewsletterOwnerNotification` table. All the data in the column will be lost.
  - You are about to drop the column `integrationId` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the `integrations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,newsLetterOwnerId]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "NewsletterOwnerNotification" DROP CONSTRAINT "NewsletterOwnerNotification_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriber" DROP CONSTRAINT "Subscriber_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriber" DROP CONSTRAINT "Subscriber_integrationId_fkey";

-- DropIndex
DROP INDEX "Campaign_integrationId_idx";

-- DropIndex
DROP INDEX "Campaign_trigger_idx";

-- DropIndex
DROP INDEX "Subscriber_email_newsLetterOwnerId_integrationId_campaignId_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "integrationId",
DROP COLUMN "trigger",
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "NewsletterOwnerNotification" DROP COLUMN "integrationId";

-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "integrationId";

-- DropTable
DROP TABLE "integrations";

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_newsLetterOwnerId_key" ON "Subscriber"("email", "newsLetterOwnerId");
