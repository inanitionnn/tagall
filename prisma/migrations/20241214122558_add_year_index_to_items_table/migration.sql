/*
  Warnings:

  - Made the column `parsedId` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Item_name_createdAt_id_idx";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "parsedId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Item_name_createdAt_year_id_idx" ON "Item"("name", "createdAt", "year", "id");
