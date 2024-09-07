-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('Pickup', 'Dropoff');

-- AlterEnum
ALTER TYPE "DeliveryStatus" ADD VALUE 'Requested';

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_driver_id_fkey";

-- DropIndex
DROP INDEX "Delivery_driver_id_key";

-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "type" "DeliveryType" NOT NULL DEFAULT 'Pickup',
ALTER COLUMN "driver_id" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
