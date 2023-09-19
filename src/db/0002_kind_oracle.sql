CREATE TABLE `rohi_comments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`episode_number` int NOT NULL,
	`image` varchar(255) NOT NULL,
	`userId` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `rohi_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `slug_idx` ON `rohi_comments` (`slug`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `rohi_comments` (`userId`);