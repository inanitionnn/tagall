ALTER TABLE "Field" RENAME COLUMN "name" TO "value";

-- DropIndex
DROP INDEX "Field_name_id_idx";

-- DropIndex
DROP INDEX "Field_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Field_value_key" ON "Field"("value");

-- CreateIndex
CREATE INDEX "Field_value_id_idx" ON "Field"("value", "id");
