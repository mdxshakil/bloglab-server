-- CreateTable
CREATE TABLE "followers" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
