/*
  Warnings:

  - You are about to drop the column `filename` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "filename",
ADD COLUMN     "file_url" TEXT NOT NULL DEFAULT '\dummyfile';
