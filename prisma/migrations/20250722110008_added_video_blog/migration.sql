/*
  Warnings:

  - Made the column `featuredImage` on table `BlogPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "featuredVideo" TEXT,
ADD COLUMN     "galleryImages" TEXT[],
ADD COLUMN     "subtitle" TEXT,
ALTER COLUMN "featuredImage" SET NOT NULL;
