CREATE TABLE `elements` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`ph` integer,
	`safetyLevel` integer,
	`imageUrl` text,
	`createdAt` text,
	`updatedAt` text
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`element1Id` text NOT NULL,
	`element2Id` text NOT NULL,
	`resultTitle` text NOT NULL,
	`observation` text NOT NULL,
	`explanation` text NOT NULL,
	`effectType` text NOT NULL,
	`safetyGuidance` text NOT NULL,
	`reviewStatus` text NOT NULL,
	`createdAt` text,
	`updatedAt` text
);
--> statement-breakpoint
CREATE TABLE `scientificReferences` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`publisher` text NOT NULL,
	`url` text NOT NULL
);
