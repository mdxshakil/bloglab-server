/*
  Warnings:

  - You are about to drop the `Following` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_followingId_fkey";

-- DropTable
DROP TABLE "Following";

-- CreateTable
CREATE TABLE "followings" (
    "id" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "followings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "followings" ADD CONSTRAINT "followings_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
