/*
  Warnings:

  - Added the required column `job_id` to the `request_access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `request_access` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "request_access" ADD COLUMN     "job_id" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "request_access" ADD CONSTRAINT "request_access_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
