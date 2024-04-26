/*
  Warnings:

  - You are about to drop the column `status` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "status",
ADD COLUMN     "analysed" BOOLEAN NOT NULL DEFAULT false;
