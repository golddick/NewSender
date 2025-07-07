-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "bounceCount" INTEGER DEFAULT 0,
ADD COLUMN     "recipients" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "name" TEXT;
