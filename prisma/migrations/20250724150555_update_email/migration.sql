/*
  Warnings:

  - The values [active,inactive] on the enum `CampaignStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [automated,instant,scheduled] on the enum `EmailType` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,inactive] on the enum `IntegrationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `scheduleType` on the `Email` table. All the data in the column will be lost.
  - Changed the type of `emailType` on the `Email` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CampaignStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "Campaign" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Campaign" ALTER COLUMN "status" TYPE "CampaignStatus_new" USING ("status"::text::"CampaignStatus_new");
ALTER TYPE "CampaignStatus" RENAME TO "CampaignStatus_old";
ALTER TYPE "CampaignStatus_new" RENAME TO "CampaignStatus";
DROP TYPE "CampaignStatus_old";
ALTER TABLE "Campaign" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
ALTER TYPE "CampaignTrigger" ADD VALUE 'new_blog_post';

-- AlterEnum
BEGIN;
CREATE TYPE "EmailType_new" AS ENUM ('AUTOMATED', 'INSTANT', 'DRAFT', 'SCHEDULE');
ALTER TABLE "Email" ALTER COLUMN "emailType" TYPE "EmailType_new" USING ("emailType"::text::"EmailType_new");
ALTER TYPE "EmailType" RENAME TO "EmailType_old";
ALTER TYPE "EmailType_new" RENAME TO "EmailType";
DROP TYPE "EmailType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "IntegrationStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "integrations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "integrations" ALTER COLUMN "status" TYPE "IntegrationStatus_new" USING ("status"::text::"IntegrationStatus_new");
ALTER TYPE "IntegrationStatus" RENAME TO "IntegrationStatus_old";
ALTER TYPE "IntegrationStatus_new" RENAME TO "IntegrationStatus";
DROP TYPE "IntegrationStatus_old";
ALTER TABLE "integrations" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriber" DROP CONSTRAINT "Subscriber_integrationId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "scheduleType",
ALTER COLUMN "campaignId" DROP NOT NULL,
ALTER COLUMN "integrationId" DROP NOT NULL,
DROP COLUMN "emailType",
ADD COLUMN     "emailType" "EmailType" NOT NULL;

-- AlterTable
ALTER TABLE "Subscriber" ALTER COLUMN "integrationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "integrations" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "ScheduleType";

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
