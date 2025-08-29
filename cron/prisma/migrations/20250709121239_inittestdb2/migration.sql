/*
  Warnings:

  - The `source` column on the `MiniNews` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MiniNews" DROP COLUMN "source",
ADD COLUMN     "source" TEXT[],
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" SET DATA TYPE TEXT;
