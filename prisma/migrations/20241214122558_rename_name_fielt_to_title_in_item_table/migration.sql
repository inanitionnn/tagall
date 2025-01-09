ALTER TABLE "Item"
RENAME COLUMN "name" TO "title";
DROP INDEX "Item_name_createdAt_year_id_idx";
CREATE INDEX "Item_title_createdAt_year_id_idx" ON "Item"(title, "createdAt", year, id)