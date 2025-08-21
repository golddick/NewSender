/*
  Warnings:

  - The `status` column on the `BlogPostFlag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `comment` to the `BlogPostFlag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flaggedBy` to the `BlogPostFlag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlagStatus" AS ENUM ('FLAGGED', 'RESOLVED');

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "flaggedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BlogPostFlag" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "flaggedBy" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FlagStatus" NOT NULL DEFAULT 'FLAGGED';
