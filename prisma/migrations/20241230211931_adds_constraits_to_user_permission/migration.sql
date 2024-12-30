/*
  Warnings:

  - A unique constraint covering the columns `[userId,permissionId,type]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `userpermission` DROP FOREIGN KEY `UserPermission_permissionId_fkey`;

-- DropIndex
DROP INDEX `UserPermission_permissionId_fkey` ON `userpermission`;

-- CreateIndex
CREATE UNIQUE INDEX `UserPermission_userId_permissionId_type_key` ON `UserPermission`(`userId`, `permissionId`, `type`);

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
