-- CreateEnum
CREATE TYPE "public"."Apps" AS ENUM ('CHATTERBOX', 'B2BMEATWEB', 'FLEETOPS', 'RENOVATOR');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "app" "public"."Apps" NOT NULL DEFAULT 'CHATTERBOX',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Groups" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contacts" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Contacts" ADD CONSTRAINT "Contacts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contacts" ADD CONSTRAINT "Contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
