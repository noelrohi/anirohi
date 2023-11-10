ALTER TABLE `rohi_account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `rohi_verificationToken` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `rohi_account` ADD PRIMARY KEY(`provider`,`providerAccountId`);--> statement-breakpoint
ALTER TABLE `rohi_verificationToken` ADD PRIMARY KEY(`identifier`,`token`);