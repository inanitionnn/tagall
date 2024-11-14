/*
  Warnings:

  - You are about to drop the `UserToCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FieldGroupToUserToCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserToCollection" DROP CONSTRAINT "UserToCollection_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "UserToCollection" DROP CONSTRAINT "UserToCollection_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FieldGroupToUserToCollection" DROP CONSTRAINT "_FieldGroupToUserToCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_FieldGroupToUserToCollection" DROP CONSTRAINT "_FieldGroupToUserToCollection_B_fkey";

-- DropTable
DROP TABLE "UserToCollection";

-- DropTable
DROP TABLE "_FieldGroupToUserToCollection";
