CREATE TABLE `employeeDataCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeName` varchar(255) NOT NULL,
	`totalHours` int NOT NULL,
	`sourceBreakdown` text NOT NULL,
	`cachedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `employeeDataCache_id` PRIMARY KEY(`id`)
);
