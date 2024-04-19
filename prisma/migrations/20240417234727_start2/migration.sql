/*
  Warnings:

  - You are about to drop the `Patients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analyse" DROP CONSTRAINT "Analyse_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Patients" DROP CONSTRAINT "Patients_userId_fkey";

-- DropTable
DROP TABLE "Patients";

-- CreateTable
CREATE TABLE "Pacients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pacients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analyse" ADD CONSTRAINT "Analyse_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Pacients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacients" ADD CONSTRAINT "Pacients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
