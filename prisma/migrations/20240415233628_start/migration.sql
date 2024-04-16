/*
  Warnings:

  - You are about to drop the column `analysed` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "analysed",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ready_for_analyse';
