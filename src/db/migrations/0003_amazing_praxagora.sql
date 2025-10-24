ALTER TABLE "qbank_question" ADD COLUMN "shelf" text;--> statement-breakpoint
ALTER TABLE "qbank_question" ADD COLUMN "organ" text;--> statement-breakpoint
ALTER TABLE "qbank_question" ADD COLUMN "clinical_setting" text;--> statement-breakpoint
ALTER TABLE "qbank_question" DROP COLUMN "categories";--> statement-breakpoint
ALTER TABLE "qbank_question" DROP COLUMN "subcategory";