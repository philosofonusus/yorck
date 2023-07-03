ALTER TABLE `address_lists` MODIFY COLUMN `addresses` json NOT NULL DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `address_lists` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `address_lists` ADD `favorites` json DEFAULT ('[]') NOT NULL;