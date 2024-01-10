/*
  Warnings:

  - You are about to drop the column `checks` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "checks",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
