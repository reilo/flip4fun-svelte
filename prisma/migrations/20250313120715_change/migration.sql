/*
  Warnings:

  - The values [DMD,LCD] on the enum `PinType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PinType_new" AS ENUM ('DataEast', 'EM', 'EE', 'Gottlieb', 'Pin2000', 'SAM', 'Spike', 'Sys11', 'WPC', 'WPC95', 'Whitestar');
ALTER TABLE "Pin" ALTER COLUMN "type" TYPE "PinType_new" USING ("type"::text::"PinType_new");
ALTER TYPE "PinType" RENAME TO "PinType_old";
ALTER TYPE "PinType_new" RENAME TO "PinType";
DROP TYPE "PinType_old";
COMMIT;
