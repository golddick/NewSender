-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'LUNCH', 'SCALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'NEWSLETTEROWNER', 'THENEWSADMIN');

-- CreateEnum
CREATE TYPE "PlanSubscriptionStatus" AS ENUM ('active', 'inactive', 'past_due', 'cancelled');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Subscribed', 'Unsubscribed');

-- CreateEnum
CREATE TYPE "CampaignTrigger" AS ENUM ('subscription', 'email_verification', 'password_reset', 'unsubscribe', 'scheduled', 'account_activation');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'SAVED', 'FAILED');

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paystackCustomerId" TEXT,
    "paystackSubscriptionId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "subscriptionStatus" "PlanSubscriptionStatus" NOT NULL DEFAULT 'inactive',
    "currentPeriodEnd" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "lastPaymentDate" TIMESTAMP(3),
    "nextPaymentDate" TIMESTAMP(3),
    "subscriberLimit" INTEGER NOT NULL DEFAULT 500,
    "emailLimit" INTEGER NOT NULL DEFAULT 2,
    "campaignLimit" INTEGER NOT NULL DEFAULT 1,
    "categoryLimit" INTEGER NOT NULL DEFAULT 1,
    "termsAndConditionsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "subscribersAdded" INTEGER NOT NULL DEFAULT 0,
    "campaignsCreated" INTEGER NOT NULL DEFAULT 0,
    "categoriesCreated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo" TEXT,
    "email" TEXT,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'inactive',
    "category" TEXT NOT NULL,
    "description" TEXT,
    "api_key" TEXT,
    "webhook_url" TEXT,
    "campaigns" INTEGER DEFAULT 0,
    "subscribers" INTEGER DEFAULT 0,
    "emails_sent" INTEGER DEFAULT 0,
    "open_rate" DOUBLE PRECISION,
    "click_rate" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "last_sync" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "trigger" "CampaignTrigger" NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'inactive',
    "integrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "open_rate" DOUBLE PRECISION,
    "click_rate" DOUBLE PRECISION,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "newsLetterOwnerId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'unknown',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'Subscribed',
    "campaignId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "pageUrl" TEXT,
    "formId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
    "newsLetterOwnerId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "lastOpened" TIMESTAMP(3),
    "lastClicked" TIMESTAMP(3),
    "openedByIps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "clickedByIps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickedLink" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_paystackCustomerId_idx" ON "Membership"("paystackCustomerId");

-- CreateIndex
CREATE INDEX "Membership_paystackSubscriptionId_idx" ON "Membership"("paystackSubscriptionId");

-- CreateIndex
CREATE INDEX "MembershipUsage_userId_idx" ON "MembershipUsage"("userId");

-- CreateIndex
CREATE INDEX "MembershipUsage_month_idx" ON "MembershipUsage"("month");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipUsage_userId_month_key" ON "MembershipUsage"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_name_key" ON "integrations"("name");

-- CreateIndex
CREATE INDEX "integrations_user_id_idx" ON "integrations"("user_id");

-- CreateIndex
CREATE INDEX "integrations_category_idx" ON "integrations"("category");

-- CreateIndex
CREATE INDEX "integrations_status_idx" ON "integrations"("status");

-- CreateIndex
CREATE INDEX "integrations_name_idx" ON "integrations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_key" ON "Campaign"("name");

-- CreateIndex
CREATE INDEX "Campaign_integrationId_idx" ON "Campaign"("integrationId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_trigger_idx" ON "Campaign"("trigger");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_newsLetterOwnerId_key" ON "Subscriber"("email", "newsLetterOwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Email_title_key" ON "Email"("title");

-- CreateIndex
CREATE INDEX "ClickedLink_emailId_idx" ON "ClickedLink"("emailId");

-- AddForeignKey
ALTER TABLE "MembershipUsage" ADD CONSTRAINT "MembershipUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Membership"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickedLink" ADD CONSTRAINT "ClickedLink_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
