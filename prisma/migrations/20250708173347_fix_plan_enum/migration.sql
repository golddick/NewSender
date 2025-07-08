/*
  Warnings:

  - The values [LUNCH] on the enum `Plan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Plan_new" AS ENUM ('FREE', 'LAUNCH', 'SCALE');
ALTER TABLE "Membership" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "Plan_old";
ALTER TABLE "Membership" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;
