-- CreateEnum
CREATE TYPE "PinType" AS ENUM ('EM', 'EE', 'DMD', 'LCD');

-- CreateEnum
CREATE TYPE "PinManu" AS ENUM ('Bally', 'DataEast', 'Gottlieb', 'Sega', 'Stern', 'Williams', 'Zaccaria');

-- CreateTable
CREATE TABLE "Pin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manu" "PinManu" NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "PinType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pin_id_key" ON "Pin"("id");
