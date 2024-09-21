/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `complaints` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "complaints_order_id_key" ON "complaints"("order_id");
