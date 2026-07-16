-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "BoyGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "debutYear" INTEGER NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "boyGroupId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "position" TEXT NOT NULL,
    "favoriteFood" TEXT,
    "funFact" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoyGroup_name_idx" ON "BoyGroup"("name");

-- CreateIndex
CREATE INDEX "Member_boyGroupId_idx" ON "Member"("boyGroupId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_boyGroupId_fkey" FOREIGN KEY ("boyGroupId") REFERENCES "BoyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
