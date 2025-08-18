-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'SUCCESS');

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "groupId" TEXT,
    "status" "public"."Status",
    "content" TEXT NOT NULL,
    "app" "public"."Apps" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
