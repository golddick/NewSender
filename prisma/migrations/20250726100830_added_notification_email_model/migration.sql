-- CreateEnum
CREATE TYPE "NotificationEmailType" AS ENUM ('NEW_BLOG_POST', 'NEW_COMMENT', 'NEW_REPLY', 'NEW_SUBSCRIBER');

-- AlterTable
ALTER TABLE "ClickedLink" ADD COLUMN     "notificationEmailId" TEXT;

-- CreateTable
CREATE TABLE "NotificationEmail" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "textContent" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
    "newsLetterOwnerId" TEXT NOT NULL,
    "integrationId" TEXT,
    "messageId" TEXT,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "recipients" INTEGER DEFAULT 0,
    "bounceCount" INTEGER DEFAULT 0,
    "lastOpened" TIMESTAMP(3),
    "lastClicked" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "openedByIps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "openedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "clickedByEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "clickedByIps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailType" "NotificationEmailType" NOT NULL,
    "trackOpens" BOOLEAN NOT NULL DEFAULT true,
    "trackClicks" BOOLEAN NOT NULL DEFAULT true,
    "enableUnsubscribe" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationEmail_title_key" ON "NotificationEmail"("title");

-- AddForeignKey
ALTER TABLE "NotificationEmail" ADD CONSTRAINT "NotificationEmail_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEmail" ADD CONSTRAINT "NotificationEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Membership"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickedLink" ADD CONSTRAINT "ClickedLink_notificationEmailId_fkey" FOREIGN KEY ("notificationEmailId") REFERENCES "NotificationEmail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
