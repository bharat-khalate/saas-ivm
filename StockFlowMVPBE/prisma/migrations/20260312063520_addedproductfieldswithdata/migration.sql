/*
  Warnings:

  - Made the column `category_id` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `filename` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "category_id" SET NOT NULL,
ALTER COLUMN "filename" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
