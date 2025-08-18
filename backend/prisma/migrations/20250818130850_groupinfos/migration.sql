/*
  Warnings:

  - Added the required column `description` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupName` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupProfile` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublic` to the `Groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Groups" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "groupName" TEXT NOT NULL,
ADD COLUMN     "groupProfile" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL;
