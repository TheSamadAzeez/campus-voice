CREATE TYPE "public"."complaint_category" AS ENUM('academic', 'facility', 'administration', 'harassment', 'infrastructure', 'result', 'sensitive', 'other');--> statement-breakpoint
CREATE TYPE "public"."complaint_status" AS ENUM('pending', 'in-review', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."faculty" AS ENUM('science', 'management science', 'art', 'law', 'transport', 'education', 'computing', 'other');--> statement-breakpoint
CREATE TYPE "public"."field_changed" AS ENUM('status', 'priority', 'created');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('status_change', 'priority_change', 'new_complaint', 'feedback_request', 'system');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('low', 'normal', 'high');--> statement-breakpoint
CREATE TYPE "public"."resolution_type" AS ENUM('immediate action', 'investigation', 'policy change', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'department-admin', 'admin');--> statement-breakpoint
CREATE TABLE "complaint_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"complaint_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_type" varchar(100) NOT NULL,
	"file_size" bigint NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"cloudinary_url" varchar(500) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaint_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"complaint_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"feedback_text" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "complaint_feedback_complaint_id_unique" UNIQUE("complaint_id")
);
--> statement-breakpoint
CREATE TABLE "complaint_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"complaint_id" uuid NOT NULL,
	"changed_by" varchar(255) NOT NULL,
	"field_changed" "field_changed" NOT NULL,
	"old_value" varchar(50),
	"new_value" varchar(50) NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"category" "complaint_category" NOT NULL,
	"faculty" "faculty" NOT NULL,
	"department" varchar(255) NOT NULL,
	"resolution_type" "resolution_type" DEFAULT 'other' NOT NULL,
	"status" "complaint_status" DEFAULT 'pending' NOT NULL,
	"priority" "priority" DEFAULT 'normal' NOT NULL,
	"sensitive" boolean DEFAULT false NOT NULL,
	"sensitive_type" varchar(255),
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"complaint_id" uuid,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "complaint_attachments" ADD CONSTRAINT "complaint_attachments_complaint_id_complaints_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_feedback" ADD CONSTRAINT "complaint_feedback_complaint_id_complaints_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_status_history" ADD CONSTRAINT "complaint_status_history_complaint_id_complaints_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_complaint_id_complaints_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaints"("id") ON DELETE set null ON UPDATE no action;