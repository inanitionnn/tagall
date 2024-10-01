-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollectionToTagCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Collection_name_createdAt_userId_id_idx" ON "Collection"("name", "createdAt", "userId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToTagCategory_AB_unique" ON "_CollectionToTagCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToTagCategory_B_index" ON "_CollectionToTagCategory"("B");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTagCategory" ADD CONSTRAINT "_CollectionToTagCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTagCategory" ADD CONSTRAINT "_CollectionToTagCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "TagCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
