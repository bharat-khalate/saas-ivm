-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "organisation_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "quantity_on_hand" INTEGER NOT NULL DEFAULT 0,
    "cost_price" DECIMAL(12,2),
    "selling_price" DECIMAL(12,2),
    "low_stock_threshold" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Product_organization_id_idx" ON "Product"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_organization_id_sku_key" ON "Product"("organization_id", "sku");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
