-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NewsletterOwnerNotificationCategory" ADD VALUE 'KYC_APPROVAL';
ALTER TYPE "NewsletterOwnerNotificationCategory" ADD VALUE 'FLAGGED';
ALTER TYPE "NewsletterOwnerNotificationCategory" ADD VALUE 'FLAGGED_RESOLVED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SystemNotificationCategory" ADD VALUE 'FLAGGED';
ALTER TYPE "SystemNotificationCategory" ADD VALUE 'FLAGGED_RESOLVED';
