/*
  Warnings:

  - The values [new_User,newsletter_Subscriber,email_verification,scheduled] on the enum `CampaignTrigger` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `automated` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CampaignTrigger_new" AS ENUM ('newUser', 'Subscriber', 'unsubscribe', 'notification');
ALTER TABLE "Campaign" ALTER COLUMN "trigger" TYPE "CampaignTrigger_new" USING ("trigger"::text::"CampaignTrigger_new");
ALTER TABLE "AutoTrigger" ALTER COLUMN "name" TYPE "CampaignTrigger_new" USING ("name"::text::"CampaignTrigger_new");
ALTER TABLE "AutoTrigger" ALTER COLUMN "trigger" TYPE "CampaignTrigger_new" USING ("trigger"::text::"CampaignTrigger_new");
ALTER TYPE "CampaignTrigger" RENAME TO "CampaignTrigger_old";
ALTER TYPE "CampaignTrigger_new" RENAME TO "CampaignTrigger";
DROP TYPE "CampaignTrigger_old";
COMMIT;

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "automated",
ALTER COLUMN "status" SET DEFAULT 'active';
