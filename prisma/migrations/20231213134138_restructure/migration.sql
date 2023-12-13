-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "checks" BOOLEAN[];

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "vip" BOOLEAN NOT NULL DEFAULT false;
