/*
  Warnings:

  - You are about to drop the column `spaceId` on the `category` table. All the data in the column will be lost.
  - The `emailVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `space` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `space_member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `space_settings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vaultId` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VaultRole" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "space" DROP CONSTRAINT "space_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "space_member" DROP CONSTRAINT "space_member_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "space_member" DROP CONSTRAINT "space_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "space_settings" DROP CONSTRAINT "space_settings_spaceId_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "spaceId",
ADD COLUMN     "vaultId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "space";

-- DropTable
DROP TABLE "space_member";

-- DropTable
DROP TABLE "space_settings";

-- DropEnum
DROP TYPE "SpaceRole";

-- CreateTable
CREATE TABLE "vault" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "accessType" "AccessType" NOT NULL DEFAULT 'PUBLIC',
    "passwordHash" TEXT,
    "discordGuildId" TEXT,
    "discordRoleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_member" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "VaultRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vault_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_settings" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "theme" TEXT DEFAULT 'light',
    "allowComments" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vault_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vault_slug_key" ON "vault"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "vault_member_vaultId_userId_key" ON "vault_member"("vaultId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "vault_settings_vaultId_key" ON "vault_settings"("vaultId");

-- AddForeignKey
ALTER TABLE "vault" ADD CONSTRAINT "vault_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_member" ADD CONSTRAINT "vault_member_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_member" ADD CONSTRAINT "vault_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_settings" ADD CONSTRAINT "vault_settings_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;
