CREATE TABLE "single_purchase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"reference_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'incomplete',
	"period_start" timestamp,
	"period_end" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"seats" integer
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"stripe_customer_id" text,
	"color" text NOT NULL,
	"grad_year" text,
	"exam" text,
	"school" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answered_qbank_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"question_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_correct" boolean
);
--> statement-breakpoint
CREATE TABLE "flashcard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folder_id" uuid NOT NULL,
	"front" text NOT NULL,
	"back" text,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_folder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foundational_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"base_id" uuid NOT NULL,
	"short_response" text,
	"answers" text[] NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "qbank_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"mode" text NOT NULL,
	"step" text NOT NULL,
	"question_ids" uuid[] NOT NULL,
	"answers" text[] NOT NULL,
	"flagged_ids" uuid[] NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "foundational_followup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"stem" text NOT NULL,
	"answer" text NOT NULL,
	"choices" jsonb NOT NULL,
	"explanations" jsonb NOT NULL,
	"axis" text NOT NULL,
	"is_integration" boolean
);
--> statement-breakpoint
CREATE TABLE "foundational_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" text NOT NULL,
	"subtopic" text,
	"shelf" text NOT NULL,
	"system" text,
	"stem" text NOT NULL,
	"expected_answer" text NOT NULL,
	"step" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qbank_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"systems" text[] NOT NULL,
	"categories" text[] NOT NULL,
	"subcategory" text,
	"topic" text NOT NULL,
	"competency" text,
	"concept" text,
	"type" text,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"choices" jsonb NOT NULL,
	"explanations" jsonb NOT NULL,
	"lab_values" jsonb[],
	"difficulty" text NOT NULL,
	"yield" text NOT NULL,
	"rating" text NOT NULL,
	"step" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_foundational_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" text NOT NULL,
	"subtopic" text,
	"shelf" text NOT NULL,
	"system" text,
	"stem" text NOT NULL,
	"expected_answer" text NOT NULL,
	"step" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_foundational_followup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"stem" text NOT NULL,
	"answer" text NOT NULL,
	"choices" jsonb NOT NULL,
	"explanations" jsonb NOT NULL,
	"axis" text NOT NULL,
	"is_integration" boolean
);
--> statement-breakpoint
CREATE TABLE "uploaded_qbank_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"systems" text[] NOT NULL,
	"categories" text[] NOT NULL,
	"subcategory" text,
	"topic" text NOT NULL,
	"competency" text,
	"concept" text,
	"type" text,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"choices" jsonb NOT NULL,
	"explanations" jsonb NOT NULL,
	"lab_values" jsonb[],
	"difficulty" text NOT NULL,
	"yield" text NOT NULL,
	"rating" text NOT NULL,
	"step" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"i_tokens" integer NOT NULL,
	"o_tokens" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "single_purchase" ADD CONSTRAINT "single_purchase_customer_id_user_stripe_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("stripe_customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answered_qbank_question" ADD CONSTRAINT "answered_qbank_question_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answered_qbank_question" ADD CONSTRAINT "answered_qbank_question_question_id_qbank_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."qbank_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard" ADD CONSTRAINT "flashcard_folder_id_flashcard_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."flashcard_folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_folder" ADD CONSTRAINT "flashcard_folder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foundational_session" ADD CONSTRAINT "foundational_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foundational_session" ADD CONSTRAINT "foundational_session_base_id_foundational_question_id_fk" FOREIGN KEY ("base_id") REFERENCES "public"."foundational_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qbank_session" ADD CONSTRAINT "qbank_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foundational_followup" ADD CONSTRAINT "foundational_followup_question_id_foundational_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."foundational_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_foundational_followup" ADD CONSTRAINT "uploaded_foundational_followup_question_id_foundational_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."foundational_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;