CREATE TABLE `rohi_anime` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`image` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`episodes` int NOT NULL,
	`anilist_id` int NOT NULL,
	CONSTRAINT `rohi_anime_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `slug_idx` ON `rohi_anime` (`slug`);--> statement-breakpoint
CREATE INDEX `anilist_idx` ON `rohi_anime` (`anilist_id`);