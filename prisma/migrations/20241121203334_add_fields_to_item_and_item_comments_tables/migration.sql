/*
  Warnings:

  - You are about to drop the column `isNumber` on the `FieldGroup` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserToItem_createdAt_userId_itemId_id_idx";

-- AlterTable
ALTER TABLE "FieldGroup" DROP COLUMN "isNumber";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "ItemComment" ADD COLUMN     "rate" INTEGER,
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'COMPLETED';

-- CreateIndex
CREATE INDEX "UserToItem_createdAt_rate_status_userId_itemId_id_idx" ON "UserToItem"("createdAt", "rate", "status", "userId", "itemId", "id");
