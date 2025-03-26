/*
  Warnings:

  - Made the column `userId` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "userId" SET NOT NULL;
