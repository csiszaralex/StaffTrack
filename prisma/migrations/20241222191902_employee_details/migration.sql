-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `motherName` VARCHAR(191) NOT NULL,
    `birthName` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `placeOfBirth` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL DEFAULT 'Hungarian',
    `sex` ENUM('Male', 'Female') NOT NULL,
    `taxId` VARCHAR(191) NOT NULL,
    `TAJ` VARCHAR(191) NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
