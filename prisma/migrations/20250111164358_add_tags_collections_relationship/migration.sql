/*
  Warnings:

  - You are about to drop the column `priority` on the `Tag` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tag_priority_id_idx";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "priority";

-- CreateTable
CREATE TABLE "_CollectionToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToTag_AB_unique" ON "_CollectionToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToTag_B_index" ON "_CollectionToTag"("B");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "_CollectionToTag" ADD CONSTRAINT "_CollectionToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTag" ADD CONSTRAINT "_CollectionToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
