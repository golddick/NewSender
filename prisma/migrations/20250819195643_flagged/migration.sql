-- CreateTable
CREATE TABLE "BlogPostFlag" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BlogPostFlag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogPostFlag" ADD CONSTRAINT "BlogPostFlag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostFlag" ADD CONSTRAINT "BlogPostFlag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Membership"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
