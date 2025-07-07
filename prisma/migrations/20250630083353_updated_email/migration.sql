/*
  Warnings:

  - You are about to drop the column `emailSubject` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the column `previewText` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the column `textContent` on the `Subscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "emailSubject" TEXT,
ADD COLUMN     "previewText" TEXT,
ADD COLUMN     "template" TEXT,
ADD COLUMN     "textContent" TEXT;

-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "emailSubject",
DROP COLUMN "previewText",
DROP COLUMN "template",
DROP COLUMN "textContent";
