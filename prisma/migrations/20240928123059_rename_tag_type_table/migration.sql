/*
  Warnings:

  - You are about to drop the column `tagTypeId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `TagType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tagCategoryId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_tagTypeId_fkey";

-- DropIndex
DROP INDEX "Tag_tagTypeId_name_id_idx";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagTypeId",
ADD COLUMN     "tagCategoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TagType";

-- CreateTable
CREATE TABLE "TagCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "isAuto" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TagCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TagCategory_priority_id_idx" ON "TagCategory"("priority", "id");

-- CreateIndex
CREATE INDEX "Tag_tagCategoryId_name_id_idx" ON "Tag"("tagCategoryId", "name", "id");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tagCategoryId_fkey" FOREIGN KEY ("tagCategoryId") REFERENCES "TagCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
