-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "selectedSizes" JSONB NOT NULL DEFAULT '[]';
