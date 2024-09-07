/*
  Warnings:

  - You are about to drop the column `driver_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('Ongoing', 'Completed');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "driver_id";

-- CreateTable
CREATE TABLE "Delivery" (
    "delivery_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'Ongoing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("delivery_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_order_id_key" ON "Delivery"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_driver_id_key" ON "Delivery"("driver_id");

-- CreateIndex
CREATE INDEX "Delivery_order_id_driver_id_idx" ON "Delivery"("order_id", "driver_id");

-- CreateIndex
CREATE INDEX "Order_transaction_id_idx" ON "Order"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
