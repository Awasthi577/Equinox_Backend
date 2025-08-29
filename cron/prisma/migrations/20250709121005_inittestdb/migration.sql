/*
  Warnings:

  - You are about to drop the column `link` on the `MiniNews` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MiniNews" DROP COLUMN "link",
ADD COLUMN     "links" TEXT[],
ADD COLUMN     "longDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "twitter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "youtube" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ytViews" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "Timeline" (
    "userId" TEXT NOT NULL,
    "miniNewsId" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("userId","miniNewsId")
);

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_miniNewsId_fkey" FOREIGN KEY ("miniNewsId") REFERENCES "MiniNews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
