PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_elements` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`ph` integer,
	`safetyLevel` integer,
	`imageUrl` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_elements`("id", "name", "icon", "description", "type", "ph", "safetyLevel", "imageUrl", "createdAt", "updatedAt") SELECT "id", "name", "icon", "description", "type", "ph", "safetyLevel", "imageUrl", "createdAt", "updatedAt" FROM `elements`;--> statement-breakpoint
DROP TABLE `elements`;--> statement-breakpoint
ALTER TABLE `__new_elements` RENAME TO `elements`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`element1Id` text NOT NULL,
	`element2Id` text NOT NULL,
	`resultTitle` text NOT NULL,
	`observation` text NOT NULL,
	`explanation` text NOT NULL,
	`effectType` text NOT NULL,
	`safetyGuidance` text NOT NULL,
	`reviewStatus` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reactions`("id", "element1Id", "element2Id", "resultTitle", "observation", "explanation", "effectType", "safetyGuidance", "reviewStatus", "createdAt", "updatedAt") SELECT "id", "element1Id", "element2Id", "resultTitle", "observation", "explanation", "effectType", "safetyGuidance", "reviewStatus", "createdAt", "updatedAt" FROM `reactions`;--> statement-breakpoint
DROP TABLE `reactions`;--> statement-breakpoint
ALTER TABLE `__new_reactions` RENAME TO `reactions`;