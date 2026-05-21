-- AlterTable
ALTER TABLE "services" ADD COLUMN     "worker_id" TEXT;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
