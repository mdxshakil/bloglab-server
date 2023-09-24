/*
  Warnings:

  - You are about to drop the column `profileId` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_profileId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "profileId";

-- CreateTable
CREATE TABLE "favouritecategories" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favouritecategories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favouritecategories" ADD CONSTRAINT "favouritecategories_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favouritecategories" ADD CONSTRAINT "favouritecategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
