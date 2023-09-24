/*
  Warnings:

  - You are about to drop the column `profession` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profession` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_profileId_fkey";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "profession" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profession";

-- DropTable
DROP TABLE "categories";

-- DropEnum
DROP TYPE "BLOG_CATEGORY";
