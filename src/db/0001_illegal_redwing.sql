CREATE TABLE `rohi_history` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255),
	`slug` varchar(255) NOT NULL,
	`pathname` varchar(255) NOT NULL,
	`episode_number` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`image` varchar(255),
	`progress` float NOT NULL,
	`duration` float NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `rohi_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `path_idx` ON `rohi_history` (`pathname`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `rohi_history` (`slug`);