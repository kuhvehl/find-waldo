/*
  Warnings:

  - You are about to drop the column `userId` on the `GameSession` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_userId_fkey";

-- DropIndex
DROP INDEX "CharacterSelection_gameSessionId_characterId_key";

-- AlterTable
ALTER TABLE "GameSession" DROP COLUMN "userId",
ADD COLUMN     "user" TEXT;

-- DropTable
DROP TABLE "User";
