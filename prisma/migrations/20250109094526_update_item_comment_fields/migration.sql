-- DropIndex
DROP INDEX "Field_value_id_idx";

-- DropIndex
DROP INDEX "Item_title_createdAt_year_id_idx";

-- DropIndex
DROP INDEX "ItemComment_createdAt_userToItemId_id_idx";

-- AlterTable
ALTER TABLE "ItemComment" ADD COLUMN     "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Field_value_fieldGroupId_idx" ON "Field"("value", "fieldGroupId");

-- CreateIndex
CREATE INDEX "Item_updatedAt_createdAt_idx" ON "Item"("updatedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Item_year_title_idx" ON "Item"("year", "title");

-- CreateIndex
CREATE INDEX "Item_parsedId_idx" ON "Item"("parsedId");

-- CreateIndex
CREATE INDEX "ItemComment_updatedAt_createdAt_idx" ON "ItemComment"("updatedAt", "createdAt");

-- CreateIndex
CREATE INDEX "ItemComment_userToItemId_idx" ON "ItemComment"("userToItemId");
