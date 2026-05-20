-- SQL Dump Schema for VibeDesk (MySQL)
-- Cocok untuk diimport langsung ke Cloud SQL MySQL

-- Drop tables if exist to ensure clean slate
DROP TABLE IF EXISTS `Phase`;
DROP TABLE IF EXISTS `Attachment`;
DROP TABLE IF EXISTS `Comment`;
DROP TABLE IF EXISTS `TicketHistory`;
DROP TABLE IF EXISTS `Notification`;
DROP TABLE IF EXISTS `AuditLog`;
DROP TABLE IF EXISTS `Ticket`;
DROP TABLE IF EXISTS `Project`;
DROP TABLE IF EXISTS `User`;

-- 1. Create Tables
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CONTRACTOR', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    `department` VARCHAR(191),
    `phoneNumber` VARCHAR(191),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Planning',
    `progress` INTEGER NOT NULL DEFAULT 0,
    `budgetAmount` DOUBLE NOT NULL DEFAULT 0,
    `spentAmount` DOUBLE NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estimatedCompletion` DATETIME(3),
    `endDate` DATETIME(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Phase` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `Phase_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Ticket` (
    `id` VARCHAR(191) NOT NULL,
    `ticketNumber` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('BUG', 'FEATURE_REQUEST', 'SUPPORT', 'GENERAL_INQUIRY', 'FEEDBACK', 'BILLING', 'TECHNICAL_ISSUE', 'OTHER') NOT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'WAITING_SUPPORT', 'RESOLVED', 'CLOSED', 'REOPENED') NOT NULL DEFAULT 'OPEN',
    `createdBy` VARCHAR(191) NOT NULL,
    `assignedTo` VARCHAR(191),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `resolvedAt` DATETIME(3),
    `closedAt` DATETIME(3),
    `dueDate` DATETIME(3),
    `resolutionTime` INTEGER,

    UNIQUE INDEX `Ticket_ticketNumber_key`(`ticketNumber`),
    INDEX `Ticket_ticketNumber_idx`(`ticketNumber`),
    INDEX `Ticket_status_idx`(`status`),
    INDEX `Ticket_priority_idx`(`priority`),
    INDEX `Ticket_category_idx`(`category`),
    INDEX `Ticket_assignedTo_idx`(`assignedTo`),
    INDEX `Ticket_createdBy_idx`(`createdBy`),
    INDEX `Ticket_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `isInternal` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `Comment_ticketId_idx`(`ticketId`),
    INDEX `Comment_userId_idx`(`userId`),
    INDEX `Comment_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Attachment` (
    `id` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` DOUBLE NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `uploadedBy` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Attachment_ticketId_idx`(`ticketId`),
    INDEX `Attachment_uploadedAt_idx`(`uploadedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TicketHistory` (
    `id` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `oldValue` TEXT,
    `newValue` TEXT,
    `changedBy` VARCHAR(191) NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TicketHistory_ticketId_idx`(`ticketId`),
    INDEX `TicketHistory_changedAt_idx`(`changedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `ticketId` VARCHAR(191),
    `type` ENUM('TICKET_ASSIGNED', 'TICKET_UPDATED', 'TICKET_CLOSED', 'COMMENT_ADDED', 'TICKET_REOPENED', 'STATUS_CHANGED', 'SYSTEM_ALERT') NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_isRead_idx`(`isRead`),
    INDEX `Notification_ticketId_idx`(`ticketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `oldValue` TEXT,
    `newValue` TEXT,
    `ipAddress` VARCHAR(191),
    `userAgent` VARCHAR(191),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_entityType_idx`(`entityType`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Add Foreign Key Constraints
ALTER TABLE `Phase` ADD CONSTRAINT `Phase_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TicketHistory` ADD CONSTRAINT `TicketHistory_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Insert Default Seed Data
INSERT INTO `User` (`id`, `email`, `name`, `password`, `role`, `department`, `phoneNumber`, `isActive`) VALUES
('1', 'admin@fitrahpro.com', 'Admin User', '$2a$12$K1dJv2fXbI5J6t6O8H0K1u5O9mQ9vD.GvB3xM8Y7A5S8B9C1D2E3F', 'SUPER_ADMIN', 'Management', '+62812345678', true),
('2', 'agent1@natagroup.com', 'Support Agent 1', '$2a$12$K1dJv2fXbI5J6t6O8H0K1u5O9mQ9vD.GvB3xM8Y7A5S8B9C1D2E3F', 'MANAGER', 'Support', '+62812345679', true),
('3', 'agent2@natagroup.com', 'Support Agent 2', '$2a$12$K1dJv2fXbI5J6t6O8H0K1u5O9mQ9vD.GvB3xM8Y7A5S8B9C1D2E3F', 'MANAGER', 'Support', '+62812345680', true),
('4', 'viewer@natagroup.com', 'Viewer User', '$2a$12$K1dJv2fXbI5J6t6O8H0K1u5O9mQ9vD.GvB3xM8Y7A5S8B9C1D2E3F', 'VIEWER', 'Management', '+62812345681', true);

INSERT INTO `Project` (`id`, `name`, `location`, `description`, `status`, `progress`, `budgetAmount`, `spentAmount`, `startDate`, `estimatedCompletion`) VALUES
('1', 'VibeDesk Initial Setup', 'Jakarta, Indonesia', 'Pembangunan platform VibeDesk.', 'In Progress', 65, 500000000, 325000000, CURRENT_TIMESTAMP(3), DATE_ADD(CURRENT_TIMESTAMP(3), INTERVAL 365 DAY));

INSERT INTO `Phase` (`id`, `projectId`, `name`, `progress`) VALUES
('p1', '1', 'Foundation & Basement', 100),
('p2', '1', 'Main Structure', 85),
('p3', '1', 'Finishing & Interior', 40),
('p4', '1', 'Testing & Handover', 0);
