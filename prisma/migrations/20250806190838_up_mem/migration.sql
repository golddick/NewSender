-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "SenderName" TEXT,
ADD COLUMN     "kycStatus" "KYCStatus" NOT NULL DEFAULT 'PENDING';
