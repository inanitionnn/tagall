/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId]` on the table `UserToItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserToItem_userId_itemId_key" ON "UserToItem"("userId", "itemId");
