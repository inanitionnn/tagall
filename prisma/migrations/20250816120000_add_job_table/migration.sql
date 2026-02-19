-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'FETCHING', 'SAVING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "result" JSONB,
    "error" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "qstashMessageId" TEXT,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Job_userId_status_idx" ON "Job"("userId", "status");

-- CreateIndex
CREATE INDEX "Job_qstashMessageId_idx" ON "Job"("qstashMessageId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
