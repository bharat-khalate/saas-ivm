/*
  Warnings:

  - You are about to drop the column `selectedSizes` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "selectedSizes",
ADD COLUMN     "selected_sezes" JSONB NOT NULL DEFAULT '[]';
