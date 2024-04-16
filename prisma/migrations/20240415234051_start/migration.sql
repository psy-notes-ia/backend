/*
  Warnings:

  - You are about to drop the column `session` on the `Analyse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analyse" DROP COLUMN "session",
ADD COLUMN     "sessions" TEXT[];
