-- CreateTable
CREATE TABLE "AlbumOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlbumOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlbumOrder_userId_idx" ON "AlbumOrder"("userId");

-- CreateIndex
CREATE INDEX "AlbumOrder_albumId_idx" ON "AlbumOrder"("albumId");

-- AddForeignKey
ALTER TABLE "AlbumOrder" ADD CONSTRAINT "AlbumOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumOrder" ADD CONSTRAINT "AlbumOrder_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
