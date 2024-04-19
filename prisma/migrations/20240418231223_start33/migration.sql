-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Pacients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
