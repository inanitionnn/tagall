/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `FieldGroup` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FieldGroup` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `FieldGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_createdAt_priority_id_idx";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "FieldGroup" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "createdAt";

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- CreateIndex
CREATE INDEX "Collection_priority_id_idx" ON "Collection"("priority", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Field_name_key" ON "Field"("name");

-- CreateIndex
CREATE INDEX "Field_name_id_idx" ON "Field"("name", "id");

-- CreateIndex
CREATE UNIQUE INDEX "FieldGroup_name_key" ON "FieldGroup"("name");

-- CreateIndex
CREATE INDEX "FieldGroup_name_id_idx" ON "FieldGroup"("name", "id");

-- CreateIndex
CREATE INDEX "Tag_priority_id_idx" ON "Tag"("priority", "id");
