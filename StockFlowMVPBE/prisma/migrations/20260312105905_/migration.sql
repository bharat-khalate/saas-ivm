/*
  Warnings:

  - You are about to drop the column `selected_sezes` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "selected_sezes",
ADD COLUMN     "selected_sizes" JSONB NOT NULL DEFAULT '[]';
