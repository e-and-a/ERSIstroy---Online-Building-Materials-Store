-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "createdById" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "createdById" TEXT;

-- CreateIndex
CREATE INDEX "Category_createdById_idx" ON "Category"("createdById");

-- CreateIndex
CREATE INDEX "Product_createdById_idx" ON "Product"("createdById");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
