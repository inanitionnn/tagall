/*
  Warnings:

  - You are about to drop the column `isSorting` on the `FieldGroup` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FieldGroup_name_priority_isSorting_isFiltering_id_idx";

-- AlterTable
ALTER TABLE "FieldGroup" DROP COLUMN "isSorting";

-- CreateIndex
CREATE INDEX "FieldGroup_name_priority_isFiltering_id_idx" ON "FieldGroup"("name", "priority", "isFiltering", "id");
