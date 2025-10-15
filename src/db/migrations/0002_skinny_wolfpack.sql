ALTER TABLE "prompts" RENAME TO "chat_log";--> statement-breakpoint
ALTER TABLE "chat_log" DROP CONSTRAINT "prompts_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_log" ADD CONSTRAINT "chat_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;