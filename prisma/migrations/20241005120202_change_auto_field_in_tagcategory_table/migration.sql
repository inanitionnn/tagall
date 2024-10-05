/*
  Warnings:

  - You are about to drop the column `isAuto` on the `TagCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TagCategory" DROP COLUMN "isAuto",
ADD COLUMN     "autoAddTags" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoAddToElement" BOOLEAN NOT NULL DEFAULT false;
