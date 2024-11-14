/*
  Warnings:

  - Added the required column `type` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "type" TEXT NOT NULL;
