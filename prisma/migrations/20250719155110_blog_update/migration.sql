/*
  Warnings:

  - Added the required column `author` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorTitle` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "authorTitle" TEXT NOT NULL;
