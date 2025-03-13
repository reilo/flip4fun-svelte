/*
  Warnings:

  - You are about to drop the column `owner` on the `Pin` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PinType" ADD VALUE 'DataEast';
ALTER TYPE "PinType" ADD VALUE 'Gottlieb';
ALTER TYPE "PinType" ADD VALUE 'Pin2000';
ALTER TYPE "PinType" ADD VALUE 'SAM';
ALTER TYPE "PinType" ADD VALUE 'Spike';
ALTER TYPE "PinType" ADD VALUE 'Sys11';
ALTER TYPE "PinType" ADD VALUE 'WPC';
ALTER TYPE "PinType" ADD VALUE 'WPC95';
ALTER TYPE "PinType" ADD VALUE 'Whitestar';

-- AlterTable
ALTER TABLE "Pin" DROP COLUMN "owner",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
