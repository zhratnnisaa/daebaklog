-- CreateTable
CREATE TABLE "Concert" (
    "id" TEXT NOT NULL,
    "boyGroupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "posterUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Concert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Concert_boyGroupId_idx" ON "Concert"("boyGroupId");

-- AddForeignKey
ALTER TABLE "Concert" ADD CONSTRAINT "Concert_boyGroupId_fkey" FOREIGN KEY ("boyGroupId") REFERENCES "BoyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
