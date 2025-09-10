CREATE TABLE "Document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" varchar(65535),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" varchar(8192)
);
--> statement-breakpoint
CREATE TABLE "KnowledgePoint" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(1024),
	"document_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserDocumentProgress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"total_knowledge_points" integer NOT NULL,
	"completed_knowledge_points" integer DEFAULT 0 NOT NULL,
	"progress_percentage" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"last_accessed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserExerciseAttempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"knowledge_point_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"question" varchar(2048) NOT NULL,
	"options" varchar(4096),
	"correct_answer" varchar(1024) NOT NULL,
	"explanation" varchar(2048),
	"difficulty" varchar(20) NOT NULL,
	"user_answer" varchar(1024),
	"is_correct" boolean NOT NULL,
	"time_spent" integer,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserProgress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"knowledge_point_id" uuid NOT NULL,
	"mastery_level" varchar(50) NOT NULL,
	"total_attempts" integer DEFAULT 0 NOT NULL,
	"correct_attempts" integer DEFAULT 0 NOT NULL,
	"average_score" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "Tag" CASCADE;--> statement-breakpoint
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "KnowledgePoint" ADD CONSTRAINT "KnowledgePoint_document_id_Document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."Document"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserDocumentProgress" ADD CONSTRAINT "UserDocumentProgress_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserDocumentProgress" ADD CONSTRAINT "UserDocumentProgress_document_id_Document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."Document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserExerciseAttempt" ADD CONSTRAINT "UserExerciseAttempt_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserExerciseAttempt" ADD CONSTRAINT "UserExerciseAttempt_knowledge_point_id_KnowledgePoint_id_fk" FOREIGN KEY ("knowledge_point_id") REFERENCES "public"."KnowledgePoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_knowledge_point_id_KnowledgePoint_id_fk" FOREIGN KEY ("knowledge_point_id") REFERENCES "public"."KnowledgePoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "document_user_idx" ON "Document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_created_at_idx" ON "Document" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "knowledge_point_title_idx" ON "KnowledgePoint" USING btree ("title");--> statement-breakpoint
CREATE INDEX "user_doc_progress_user_doc_idx" ON "UserDocumentProgress" USING btree ("user_id","document_id");--> statement-breakpoint
CREATE INDEX "user_exercise_user_idx" ON "UserExerciseAttempt" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_exercise_kp_idx" ON "UserExerciseAttempt" USING btree ("knowledge_point_id");--> statement-breakpoint
CREATE INDEX "user_progress_user_kp_idx" ON "UserProgress" USING btree ("user_id","knowledge_point_id");--> statement-breakpoint
CREATE INDEX "user_progress_mastery_idx" ON "UserProgress" USING btree ("mastery_level");