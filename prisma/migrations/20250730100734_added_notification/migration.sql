/*
  Warnings:

  - You are about to drop the `NotificationEmail` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SYSTEM', 'PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('WELCOME', 'NEWSLETTER', 'NEW_BLOG', 'BLOG_APPROVAL', 'NEW_KYC', 'KYC_APPROVAL', 'PAYMENT_SUCCESS', 'CAMPAIGN_ALERT', 'SECURITY_ALERT', 'INTEGRATION_SUCCESS', 'SUBSCRIPTION_REMINDER', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('DRAFT', 'PENDING', 'SENDING', 'SENT', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- DropForeignKey
ALTER TABLE "NotificationEmail" DROP CONSTRAINT "NotificationEmail_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationEmail" DROP CONSTRAINT "NotificationEmail_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationEmailClickedLink" DROP CONSTRAINT "NotificationEmailClickedLink_notificationEmailId_fkey";

-- DropTable
DROP TABLE "NotificationEmail";

-- DropEnum
DROP TYPE "NotificationEmailType";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "textContent" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "userId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "emailsSent" INTEGER DEFAULT 0,
    "openCount" INTEGER DEFAULT 0,
    "clickCount" INTEGER DEFAULT 0,
    "recipients" INTEGER DEFAULT 0,
    "bounceCount" INTEGER DEFAULT 0,
    "lastOpened" TIMESTAMP(3),
    "lastClicked" TIMESTAMP(3),
    "integrationId" TEXT,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "securityAlerts" BOOLEAN NOT NULL DEFAULT true,
    "productUpdates" BOOLEAN NOT NULL DEFAULT true,
    "newsletterReminders" BOOLEAN NOT NULL DEFAULT true,
    "campaignReports" BOOLEAN NOT NULL DEFAULT true,
    "blogApprovalNotifications" BOOLEAN NOT NULL DEFAULT true,
    "kycNotifications" BOOLEAN NOT NULL DEFAULT true,
    "paymentNotifications" BOOLEAN NOT NULL DEFAULT true,
    "integrationNotifications" BOOLEAN NOT NULL DEFAULT true,
    "achievementNotifications" BOOLEAN NOT NULL DEFAULT true,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT true,
    "instantAlerts" BOOLEAN NOT NULL DEFAULT true,
    "lowEngagementAlerts" BOOLEAN NOT NULL DEFAULT false,
    "highEngagementAlerts" BOOLEAN NOT NULL DEFAULT true,
    "bounceAlerts" BOOLEAN NOT NULL DEFAULT true,
    "unsubscribeAlerts" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_category_idx" ON "Notification"("category");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Membership"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Membership"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEmailClickedLink" ADD CONSTRAINT "NotificationEmailClickedLink_notificationEmailId_fkey" FOREIGN KEY ("notificationEmailId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
