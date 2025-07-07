/*
  Warnings:

  - The values [nuewletter_Subscriber] on the enum `CampaignTrigger` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CampaignTrigger_new" AS ENUM ('new_User', 'newsletter_Subscriber', 'email_verification', 'unsubscribe', 'scheduled', 'notification');
ALTER TABLE "Campaign" ALTER COLUMN "trigger" TYPE "CampaignTrigger_new" USING ("trigger"::text::"CampaignTrigger_new");
ALTER TABLE "AutoTrigger" ALTER COLUMN "name" TYPE "CampaignTrigger_new" USING ("name"::text::"CampaignTrigger_new");
ALTER TABLE "AutoTrigger" ALTER COLUMN "trigger" TYPE "CampaignTrigger_new" USING ("trigger"::text::"CampaignTrigger_new");
ALTER TYPE "CampaignTrigger" RENAME TO "CampaignTrigger_old";
ALTER TYPE "CampaignTrigger_new" RENAME TO "CampaignTrigger";
DROP TYPE "CampaignTrigger_old";
COMMIT;

-- DropIndex
DROP INDEX "Email_campaignId_key";
