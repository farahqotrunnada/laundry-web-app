-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('Verification', 'PasswordReset', 'EmailChange');

-- CreateTable
CREATE TABLE "email_log" (
    "email_log_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "EmailType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_log_pkey" PRIMARY KEY ("email_log_id")
);
