-- CreateTable
CREATE TABLE "ProductTranslation" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_product_id_language_key" ON "ProductTranslation"("product_id", "language");

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
