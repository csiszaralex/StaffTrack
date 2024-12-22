-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tableName` VARCHAR(191) NOT NULL,
    `recordId` INTEGER NOT NULL,
    `action` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    `previousState` JSON NULL,
    `newState` JSON NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
