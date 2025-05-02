/*
  Warnings:

  - You are about to drop the column `discussionId` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `replyId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `SavedJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedScholarship` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,itemId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,itemId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_jobId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedScholarship" DROP CONSTRAINT "SavedScholarship_scholarshipId_fkey";

-- DropForeignKey
ALTER TABLE "SavedScholarship" DROP CONSTRAINT "SavedScholarship_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_replyId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_reviewId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "discussionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemId" TEXT,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "replyId",
DROP COLUMN "reviewId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "SavedJob";

-- DropTable
DROP TABLE "SavedScholarship";

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_itemId_key" ON "Bookmark"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_itemId_key" ON "Vote"("userId", "itemId");
