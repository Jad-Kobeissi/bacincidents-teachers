/*
  Warnings:

  - You are about to drop the column `type` on the `Incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "type";

-- DropEnum
DROP TYPE "Type";
