/*
  Warnings:

  - You are about to drop the column `previousState` on the `auditlog` table. All the data in the column will be lost.
  - The values [INSERT] on the enum `AuditLog_action` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `auditlog` DROP COLUMN `previousState`,
    MODIFY `action` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL;
