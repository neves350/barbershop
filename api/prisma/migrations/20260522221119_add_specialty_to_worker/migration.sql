/*
  Warnings:

  - You are about to drop the column `initials` on the `workers` table. All the data in the column will be lost.
  - Added the required column `specialty` to the `workers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkerSpecialty" AS ENUM ('BEAUTICIAN', 'ESTHETICS');

-- AlterTable
ALTER TABLE "workers" DROP COLUMN "initials",
ADD COLUMN     "specialty" "WorkerSpecialty" NOT NULL;
