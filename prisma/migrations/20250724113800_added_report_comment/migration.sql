-- CreateTable
CREATE TABLE "ReportedComment" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "blogSlug" TEXT NOT NULL,
    "blogOwner" TEXT NOT NULL,
    "parentCommentBy" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reason" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReportedComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportedComment" ADD CONSTRAINT "ReportedComment_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "Membership"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedComment" ADD CONSTRAINT "ReportedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BlogComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
