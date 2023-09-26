-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
