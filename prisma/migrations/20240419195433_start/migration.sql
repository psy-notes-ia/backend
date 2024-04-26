/*
  Warnings:

  - You are about to drop the column `patientId` on the `Analyse` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Notes` table. All the data in the column will be lost.
  - Added the required column `pacientId` to the `Analyse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pacientId` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analyse" DROP CONSTRAINT "Analyse_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_patientId_fkey";

-- AlterTable
ALTER TABLE "Analyse" DROP COLUMN "patientId",
ADD COLUMN     "pacientId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "patientId",
ADD COLUMN     "pacientId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "Pacients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analyse" ADD CONSTRAINT "Analyse_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "Pacients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
