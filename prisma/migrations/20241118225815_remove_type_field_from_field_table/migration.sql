/*
  Warnings:

  - You are about to drop the column `type` on the `Field` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FieldGroup_name_id_idx";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "type";

-- CreateIndex
CREATE INDEX "FieldGroup_name_priority_isSorting_isFiltering_id_idx" ON "FieldGroup"("name", "priority", "isSorting", "isFiltering", "id");
