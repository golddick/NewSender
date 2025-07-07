/*
  Warnings:

  - A unique constraint covering the columns `[campaignId]` on the table `Email` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campaignId]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AutoTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" "CampaignTrigger" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'inactive',
    "integrationId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutoTrigger_name_key" ON "AutoTrigger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AutoTrigger_campaignId_key" ON "AutoTrigger"("campaignId");

-- CreateIndex
CREATE INDEX "AutoTrigger_integrationId_idx" ON "AutoTrigger"("integrationId");

-- CreateIndex
CREATE INDEX "AutoTrigger_status_idx" ON "AutoTrigger"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Email_campaignId_key" ON "Email"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_campaignId_key" ON "Subscriber"("campaignId");

-- AddForeignKey
ALTER TABLE "AutoTrigger" ADD CONSTRAINT "AutoTrigger_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoTrigger" ADD CONSTRAINT "AutoTrigger_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
