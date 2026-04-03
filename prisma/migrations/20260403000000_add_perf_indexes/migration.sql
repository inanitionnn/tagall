-- Add index on Item.collectionId for faster collection-scoped filtering
CREATE INDEX "Item_collectionId_idx" ON "Item"("collectionId");

-- Add index on UserToItem.userId for faster user-scoped queries
CREATE INDEX "UserToItem_userId_idx" ON "UserToItem"("userId");

-- Add index on UserToItem.updatedAt for date stats queries
CREATE INDEX "UserToItem_updatedAt_idx" ON "UserToItem"("updatedAt");
