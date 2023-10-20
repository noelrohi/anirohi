ALTER TABLE `rohi_comments` RENAME COLUMN `image` TO `text`;--> statement-breakpoint
ALTER TABLE `rohi_comments` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `rohi_history` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;