/*
  Warnings:

  - The primary key for the `Pin` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Pin_id_key";

-- AlterTable
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pin_id_seq";
