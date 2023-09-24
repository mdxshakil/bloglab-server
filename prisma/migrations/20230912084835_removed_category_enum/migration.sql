/*
  Warnings:

  - Changed the type of `title` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "title",
ADD COLUMN     "title" TEXT NOT NULL;

-- DropEnum
DROP TYPE "BLOG_CATEGORY";

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");
