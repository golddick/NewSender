/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NewsletterOwnerNotificationCategory" AS ENUM ('WELCOME', 'NEWSLETTER', 'NEW_BLOG');

-- CreateEnum
CREATE TYPE "SystemNotificationCategory" AS ENUM ('WELCOME', 'NEWSLETTER', 'NEW_BLOG', 'BLOG_APPROVAL', 'BLOG_POST_ENAGEMENT', 'NEW_KYC', 'KYC_APPROVAL', 'PAYMENT_SUCCESS', 'CAMPAIGN_ALERT', 'SECURITY_ALERT', 'INTEGRATION_SUCCESS', 'SUBSCRIPTION_REMINDER', 'ACHIEVEMENT');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationEmailClickedLink" DROP CONSTRAINT "NotificationEmailClickedLink_notificationEmailId_fkey";

-- AlterTable
ALTER TABLE "NotificationEmailClickedLink" ADD COLUMN     "systemNotificationId" TEXT,
ALTER COLUMN "notificationEmailId" DROP NOT NULL;

-- DropTable
DROP TABLE "Notification";

-- DropEnum
DROP TYPE "NotificationCategory";

-- CreateTable
CREATE TABLE "NewsletterOwnerNotification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "category" "NewsletterOwnerNotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "textContent" TEXT,
    "htmlContent" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "userId" TEXT NOT NULL,
    "recipient" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER DEFAULT 0,
    "openCount" INTEGER DEFAULT 0,
    "clickCount" INTEGER DEFAULT 0,
    "recipients" INTEGER DEFAULT 0,
    "bounceCount" INTEGER DEFAULT 0,
    "openedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "clickedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastOpened" TIMESTAMP(3),
    "lastClicked" TIMESTAMP(3),
    "integrationId" TEXT,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsletterOwnerNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemNotification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "category" "SystemNotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "textContent" TEXT,
    "htmlContent" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "recipient" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER DEFAULT 0,
    "openCount" INTEGER DEFAULT 0,
    "clickCount" INTEGER DEFAULT 0,
    "recipients" INTEGER DEFAULT 0,
    "bounceCount" INTEGER DEFAULT 0,
    "openedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "clickedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastOpened" TIMESTAMP(3),
    "lastClicked" TIMESTAMP(3),
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterOwnerNotification_userId_idx" ON "NewsletterOwnerNotification"("userId");

-- CreateIndex
CREATE INDEX "NewsletterOwnerNotification_status_idx" ON "NewsletterOwnerNotification"("status");

-- CreateIndex
CREATE INDEX "NewsletterOwnerNotification_type_idx" ON "NewsletterOwnerNotification"("type");

-- CreateIndex
CREATE INDEX "NewsletterOwnerNotification_category_idx" ON "NewsletterOwnerNotification"("category");

-- CreateIndex
CREATE INDEX "SystemNotification_status_idx" ON "SystemNotification"("status");

-- CreateIndex
CREATE INDEX "SystemNotification_type_idx" ON "SystemNotification"("type");

-- CreateIndex
CREATE INDEX "SystemNotification_category_idx" ON "SystemNotification"("category");

-- AddForeignKey
ALTER TABLE "NewsletterOwnerNotification" ADD CONSTRAINT "NewsletterOwnerNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Membership"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterOwnerNotification" ADD CONSTRAINT "NewsletterOwnerNotification_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEmailClickedLink" ADD CONSTRAINT "NotificationEmailClickedLink_notificationEmailId_fkey" FOREIGN KEY ("notificationEmailId") REFERENCES "NewsletterOwnerNotification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEmailClickedLink" ADD CONSTRAINT "NotificationEmailClickedLink_systemNotificationId_fkey" FOREIGN KEY ("systemNotificationId") REFERENCES "SystemNotification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
