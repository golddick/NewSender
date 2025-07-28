/*
  Warnings:

  - You are about to drop the column `notificationEmailId` on the `ClickedLink` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClickedLink" DROP CONSTRAINT "ClickedLink_notificationEmailId_fkey";

-- AlterTable
ALTER TABLE "ClickedLink" DROP COLUMN "notificationEmailId",
ADD COLUMN     "clickedBy" TEXT;

-- CreateTable
CREATE TABLE "NotificationEmailClickedLink" (
    "id" TEXT NOT NULL,
    "notificationEmailId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clickedBy" TEXT,

    CONSTRAINT "NotificationEmailClickedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationEmailClickedLink_notificationEmailId_idx" ON "NotificationEmailClickedLink"("notificationEmailId");

-- AddForeignKey
ALTER TABLE "NotificationEmailClickedLink" ADD CONSTRAINT "NotificationEmailClickedLink_notificationEmailId_fkey" FOREIGN KEY ("notificationEmailId") REFERENCES "NotificationEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
