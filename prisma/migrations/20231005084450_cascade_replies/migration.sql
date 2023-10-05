-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_commentId_fkey";

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
