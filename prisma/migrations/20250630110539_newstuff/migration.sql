/*
  Warnings:

  - The values [subscription,password_reset,account_activation] on the enum `CampaignTrigger` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `name` on the `AutoTrigger` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CampaignTrigger_new" AS ENUM ('new_User', 'nuewletter_Subscriber', 'email_verification', 'unsubscribe', 'scheduled', 'notification');
ALTER TABLE "Campaign" ALTER COLUMN "trigger" TYPE "CampaignTrigger_new" USING ("trigger"::text::"CampaignTrigger_new");
ALTER TABLE "AutoTrigger" ALTER COLUMN "name" TYPE "CampaignTrigger_new" USING ("name"::text::"CampaignTrigger_new");
ALTER TABLE "AutoTrigger" ALTER COLUMN "trigger" TYPE "CampaignTrigger_new" USING ("trigger"::text::"CampaignTrigger_new");
ALTER TYPE "CampaignTrigger" RENAME TO "CampaignTrigger_old";
ALTER TYPE "CampaignTrigger_new" RENAME TO "CampaignTrigger";
DROP TYPE "CampaignTrigger_old";
COMMIT;

-- AlterTable
ALTER TABLE "AutoTrigger" DROP COLUMN "name",
ADD COLUMN     "name" "CampaignTrigger" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "automated" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "AutoTrigger_name_key" ON "AutoTrigger"("name");
