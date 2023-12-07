-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('Planned', 'Active', 'Paused', 'Stopped', 'Completed', 'Archived');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "status" "TournamentStatus" NOT NULL DEFAULT 'Planned',
ADD COLUMN     "testMode" BOOLEAN NOT NULL DEFAULT true;
