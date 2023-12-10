/*
  Warnings:

  - The values [Paused,Archived] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('Planned', 'Ready', 'Active', 'Stopped', 'Completed');
ALTER TABLE "Tournament" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "TournamentStatus_old";
ALTER TABLE "Tournament" ALTER COLUMN "status" SET DEFAULT 'Planned';
COMMIT;

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vip" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "guests" TEXT[],
    "counts" INTEGER[],

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
