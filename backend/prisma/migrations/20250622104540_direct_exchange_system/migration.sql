/*
  Warnings:

  - You are about to drop the column `exchangeId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `exchange_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_skills` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicationId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "exchange_requests" DROP CONSTRAINT "exchange_requests_studentId_fkey";

-- DropForeignKey
ALTER TABLE "exchange_requests" DROP CONSTRAINT "exchange_requests_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_exchangeId_fkey";

-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_skillId_fkey";

-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_userId_fkey";

-- DropIndex
DROP INDEX "reviews_exchangeId_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "exchangeId",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "exchange_requests";

-- DropTable
DROP TABLE "skills";

-- DropTable
DROP TABLE "user_skills";

-- DropEnum
DROP TYPE "ExchangeStatus";

-- DropEnum
DROP TYPE "SkillLevel";

-- DropEnum
DROP TYPE "SkillType";

-- CreateTable
CREATE TABLE "skill_requests" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skillNeeded" TEXT NOT NULL,
    "skillOffered" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "estimatedDuration" TEXT,
    "deadline" TIMESTAMP(3),
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "requirements" TEXT[],
    "deliverables" TEXT[],
    "tags" TEXT[],
    "status" "SkillRequestStatus" NOT NULL DEFAULT 'OPEN',
    "acceptedApplicantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "skillRequestId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "proposedTimeline" TEXT,
    "portfolio" TEXT[],
    "experience" TEXT,
    "whyChooseMe" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "responseMessage" TEXT,
    "respondedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_request_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillRequestId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_request_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_skillRequestId_applicantId_key" ON "applications"("skillRequestId", "applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_request_views_userId_skillRequestId_key" ON "skill_request_views"("userId", "skillRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_applicationId_key" ON "reviews"("applicationId");

-- AddForeignKey
ALTER TABLE "skill_requests" ADD CONSTRAINT "skill_requests_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_skillRequestId_fkey" FOREIGN KEY ("skillRequestId") REFERENCES "skill_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_request_views" ADD CONSTRAINT "skill_request_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_request_views" ADD CONSTRAINT "skill_request_views_skillRequestId_fkey" FOREIGN KEY ("skillRequestId") REFERENCES "skill_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
