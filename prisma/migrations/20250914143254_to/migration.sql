/*
  Warnings:

  - The primary key for the `ThirdPartyOTP` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ThirdPartyOTP` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ThirdPartyOTP" DROP CONSTRAINT "ThirdPartyOTP_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ThirdPartyOTP_pkey" PRIMARY KEY ("email");
