/*
  Warnings:

  - You are about to drop the column `accountStatus` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `contactNo` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BLOG_CATEGORY" AS ENUM ('art', 'travel', 'health', 'finance', 'web_development', 'tech', 'database', 'hardware');

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "accountStatus",
ADD COLUMN     "contactNo" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountStatus" "ACCOUNT_STATUS" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" "BLOG_CATEGORY" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
