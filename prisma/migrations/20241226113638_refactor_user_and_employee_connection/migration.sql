/*
  Warnings:

  - You are about to drop the column `email` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `employee` table. All the data in the column will be lost.
  - Made the column `userId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `email`,
    DROP COLUMN `name`,
    MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
