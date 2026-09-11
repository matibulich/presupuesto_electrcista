/*
  Warnings:

  - You are about to drop the column `servicePrice` on the `WorkOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkOrder" DROP COLUMN "servicePrice",
ADD COLUMN     "budget" DOUBLE PRECISION;
