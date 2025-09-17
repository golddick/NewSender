-- AlterTable
ALTER TABLE "BlogComment" ADD COLUMN     "externalAvatar" TEXT,
ADD COLUMN     "externalName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
