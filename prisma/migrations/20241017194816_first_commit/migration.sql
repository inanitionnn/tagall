-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "UserToItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userToItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ItemComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultCollectionId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultCollection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DefaultCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParseMethod" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "ParseMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "tagCategoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultTag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "defaultTagCategoryId" TEXT,

    CONSTRAINT "DefaultTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isItemHasMany" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TagCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultTagCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isItemHasMany" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DefaultTagCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemCommentToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionToTagCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DefaultCollectionToDefaultTagCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DefaultCollectionToParseMethod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TagToUserToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DefaultTagToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_id_email_idx" ON "User"("role", "id", "email");

-- CreateIndex
CREATE INDEX "UserToItem_createdAt_userId_itemId_id_idx" ON "UserToItem"("createdAt", "userId", "itemId", "id");

-- CreateIndex
CREATE INDEX "ItemComment_createdAt_userId_userToItemId_id_idx" ON "ItemComment"("createdAt", "userId", "userToItemId", "id");

-- CreateIndex
CREATE INDEX "Collection_name_createdAt_userId_id_idx" ON "Collection"("name", "createdAt", "userId", "id");

-- CreateIndex
CREATE INDEX "Tag_createdAt_tagCategoryId_userId_id_idx" ON "Tag"("createdAt", "tagCategoryId", "userId", "id");

-- CreateIndex
CREATE INDEX "DefaultTag_defaultTagCategoryId_id_idx" ON "DefaultTag"("defaultTagCategoryId", "id");

-- CreateIndex
CREATE INDEX "TagCategory_createdAt_priority_userId_id_idx" ON "TagCategory"("createdAt", "priority", "userId", "id");

-- CreateIndex
CREATE INDEX "DefaultTagCategory_priority_id_idx" ON "DefaultTagCategory"("priority", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemCommentToTag_AB_unique" ON "_ItemCommentToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemCommentToTag_B_index" ON "_ItemCommentToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToTagCategory_AB_unique" ON "_CollectionToTagCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToTagCategory_B_index" ON "_CollectionToTagCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DefaultCollectionToDefaultTagCategory_AB_unique" ON "_DefaultCollectionToDefaultTagCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_DefaultCollectionToDefaultTagCategory_B_index" ON "_DefaultCollectionToDefaultTagCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DefaultCollectionToParseMethod_AB_unique" ON "_DefaultCollectionToParseMethod"("A", "B");

-- CreateIndex
CREATE INDEX "_DefaultCollectionToParseMethod_B_index" ON "_DefaultCollectionToParseMethod"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToUserToItem_AB_unique" ON "_TagToUserToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToUserToItem_B_index" ON "_TagToUserToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DefaultTagToItem_AB_unique" ON "_DefaultTagToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_DefaultTagToItem_B_index" ON "_DefaultTagToItem"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToItem" ADD CONSTRAINT "UserToItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToItem" ADD CONSTRAINT "UserToItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToItem" ADD CONSTRAINT "UserToItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_userToItemId_fkey" FOREIGN KEY ("userToItemId") REFERENCES "UserToItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_defaultCollectionId_fkey" FOREIGN KEY ("defaultCollectionId") REFERENCES "DefaultCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tagCategoryId_fkey" FOREIGN KEY ("tagCategoryId") REFERENCES "TagCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultTag" ADD CONSTRAINT "DefaultTag_defaultTagCategoryId_fkey" FOREIGN KEY ("defaultTagCategoryId") REFERENCES "DefaultTagCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagCategory" ADD CONSTRAINT "TagCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemCommentToTag" ADD CONSTRAINT "_ItemCommentToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ItemComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemCommentToTag" ADD CONSTRAINT "_ItemCommentToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTagCategory" ADD CONSTRAINT "_CollectionToTagCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTagCategory" ADD CONSTRAINT "_CollectionToTagCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "TagCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultCollectionToDefaultTagCategory" ADD CONSTRAINT "_DefaultCollectionToDefaultTagCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "DefaultCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultCollectionToDefaultTagCategory" ADD CONSTRAINT "_DefaultCollectionToDefaultTagCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "DefaultTagCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultCollectionToParseMethod" ADD CONSTRAINT "_DefaultCollectionToParseMethod_A_fkey" FOREIGN KEY ("A") REFERENCES "DefaultCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultCollectionToParseMethod" ADD CONSTRAINT "_DefaultCollectionToParseMethod_B_fkey" FOREIGN KEY ("B") REFERENCES "ParseMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToUserToItem" ADD CONSTRAINT "_TagToUserToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToUserToItem" ADD CONSTRAINT "_TagToUserToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "UserToItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultTagToItem" ADD CONSTRAINT "_DefaultTagToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "DefaultTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultTagToItem" ADD CONSTRAINT "_DefaultTagToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
