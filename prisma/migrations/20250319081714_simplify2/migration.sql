/*
  Warnings:

  - The `status` column on the `Tournament` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TourStatus" AS ENUM ('Planned', 'Active', 'Completed');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "TourStatus" NOT NULL DEFAULT 'Planned';

-- DropEnum
DROP TYPE "TournamentStatus";
