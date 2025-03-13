/*
  Warnings:

  - The values [Stopped] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `arenas` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `testMode` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('Planned', 'Ready', 'Active', 'Completed');
ALTER TABLE "Tournament" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "TournamentStatus_old";
ALTER TABLE "Tournament" ALTER COLUMN "status" SET DEFAULT 'Planned';
COMMIT;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "arenas",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "testMode";

-- DropTable
DROP TABLE "Appointment";
