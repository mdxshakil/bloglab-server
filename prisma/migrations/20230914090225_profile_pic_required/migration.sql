/*
  Warnings:

  - Made the column `profilePicture` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "profilePicture" SET NOT NULL;
