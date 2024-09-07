-- DropIndex
DROP INDEX "Delivery_order_id_key";

-- CreateTable
CREATE TABLE "Outlet" (
    "outlet_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outlet_pkey" PRIMARY KEY ("outlet_id")
);

-- CreateTable
CREATE TABLE "OutletAddress" (
    "outlet_address_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "latitude" DECIMAL(11,7) NOT NULL,
    "longitude" DECIMAL(11,7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutletAddress_pkey" PRIMARY KEY ("outlet_address_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutletAddress_outlet_id_key" ON "OutletAddress"("outlet_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "Outlet"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutletAddress" ADD CONSTRAINT "OutletAddress_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "Outlet"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
