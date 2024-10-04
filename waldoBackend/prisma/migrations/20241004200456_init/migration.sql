/*
  Warnings:

  - A unique constraint covering the columns `[gameSessionId,characterId]` on the table `CharacterSelection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[characterId,x,y]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `imageUrl` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSelection_gameSessionId_characterId_key" ON "CharacterSelection"("gameSessionId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_characterId_x_y_key" ON "Location"("characterId", "x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
