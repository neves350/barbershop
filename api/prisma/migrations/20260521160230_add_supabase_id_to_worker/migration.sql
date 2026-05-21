/*
  Warnings:

  - A unique constraint covering the columns `[supabase_id]` on the table `workers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabase_id` to the `workers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "supabase_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workers_supabase_id_key" ON "workers"("supabase_id");
