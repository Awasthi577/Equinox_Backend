/*
  Warnings:

  - You are about to drop the column `source` on the `MiniNews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MiniNews" DROP COLUMN "source",
ADD COLUMN     "sources" TEXT[];
