-- CreateTable
CREATE TABLE "Settings" (
    "settings_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "default_low_stock_threshold" INTEGER,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("settings_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_organization_id_key" ON "Settings"("organization_id");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
