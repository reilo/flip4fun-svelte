-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('FlipLiga', 'FlipFinal');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "forename" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "shortname" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TournamentType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "players" TEXT[],
    "arenas" TEXT[],
    "settings" JSONB NOT NULL,
    "results" JSONB NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);
