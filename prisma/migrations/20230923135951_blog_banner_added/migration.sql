/*
  Warnings:

  - Added the required column `banner` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "banner" TEXT NOT NULL;
