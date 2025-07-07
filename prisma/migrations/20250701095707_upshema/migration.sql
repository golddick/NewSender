/*
  Warnings:

  - You are about to drop the column `categoryLimit` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `categoriesCreated` on the `MembershipUsage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,newsLetterOwnerId,integrationId,campaignId]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscriber_campaignId_key";

-- DropIndex
DROP INDEX "Subscriber_email_newsLetterOwnerId_key";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "recipients" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "emailsSent" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "categoryLimit",
ADD COLUMN     "appIntegratedLimit" INTEGER NOT NULL DEFAULT 2,
ALTER COLUMN "emailLimit" SET DEFAULT 5,
ALTER COLUMN "campaignLimit" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "MembershipUsage" DROP COLUMN "categoriesCreated",
ADD COLUMN     "appIntegrated" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "integrations" ADD COLUMN     "recipients" INTEGER DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_newsLetterOwnerId_integrationId_campaignId_key" ON "Subscriber"("email", "newsLetterOwnerId", "integrationId", "campaignId");
