/*
  Warnings:

  - You are about to drop the column `longDescription` on the `MiniNews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MiniNews" DROP COLUMN "longDescription",
ADD COLUMN     "bias" TEXT[];
