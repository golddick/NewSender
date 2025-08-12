/*
  Warnings:

  - You are about to drop the column `appIntegrated` on the `MembershipUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "externalId" TEXT;

-- AlterTable
ALTER TABLE "MembershipUsage" DROP COLUMN "appIntegrated";
