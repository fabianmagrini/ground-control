CREATE EXTENSION IF NOT EXISTS pgcrypto;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('Awaiting review', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."eval_status" AS ENUM('Pass', 'Watch', 'Failed');--> statement-breakpoint
CREATE TYPE "public"."knowledge_source_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('agent', 'customer');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('Premium', 'Enterprise');--> statement-breakpoint
CREATE TYPE "public"."prompt_status" AS ENUM('draft', 'active', 'retired');--> statement-breakpoint
CREATE TYPE "public"."risk" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('P1', 'P2', 'P3');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('Open', 'Pending customer', 'Waiting on Engineering', 'Resolved');--> statement-breakpoint
CREATE TYPE "public"."trace_validation_status" AS ENUM('Pass', 'Needs review', 'Blocked');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'support_manager', 'support_agent', 'billing_ops', 'engineering', 'trust');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"external_id" varchar(120),
	"name" text NOT NULL,
	"plan" "plan" NOT NULL,
	"arr" varchar(80) NOT NULL,
	"health" integer NOT NULL,
	"region" varchar(80) NOT NULL,
	"csm_user_id" uuid,
	"renewal" varchar(120) NOT NULL,
	"incidents" text NOT NULL,
	"contract" text NOT NULL,
	"data_residency" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	"trace_id" uuid,
	"external_id" varchar(120),
	"requested_by_user_id" uuid,
	"reviewed_by_user_id" uuid,
	"risk" "risk" NOT NULL,
	"reason" text NOT NULL,
	"status" "approval_status" NOT NULL,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"actor_name" text NOT NULL,
	"event" text NOT NULL,
	"entity_type" varchar(80),
	"entity_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"knowledge_source_id" uuid NOT NULL,
	"ordinal" integer NOT NULL,
	"content" text NOT NULL,
	"embedding_model" varchar(160),
	"embedding" vector(1536),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"prompt_id" uuid,
	"external_id" varchar(120),
	"name" text NOT NULL,
	"prompt_version" varchar(80) NOT NULL,
	"status" "eval_status" NOT NULL,
	"score" integer NOT NULL,
	"threshold" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"external_id" varchar(120) NOT NULL,
	"title" text NOT NULL,
	"topic" varchar(120) NOT NULL,
	"freshness" varchar(120) NOT NULL,
	"access_policy" text NOT NULL,
	"owner_user_id" uuid,
	"owner_name" text NOT NULL,
	"body" text NOT NULL,
	"status" "knowledge_source_status" DEFAULT 'draft' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	"author_user_id" uuid,
	"sender_name" text NOT NULL,
	"role" "message_role" NOT NULL,
	"body" text NOT NULL,
	"sent_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" varchar(120) NOT NULL,
	"version" varchar(80) NOT NULL,
	"status" "prompt_status" DEFAULT 'draft' NOT NULL,
	"model" varchar(160) NOT NULL,
	"provider" varchar(160) NOT NULL,
	"system_text" text NOT NULL,
	"user_template" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" text NOT NULL,
	"region" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"owner_id" uuid,
	"external_id" varchar(120) NOT NULL,
	"title" text NOT NULL,
	"priority" "ticket_priority" NOT NULL,
	"sla" varchar(80) NOT NULL,
	"status" "ticket_status" NOT NULL,
	"sentiment" varchar(120) NOT NULL,
	"impact" text NOT NULL,
	"risk" "risk" NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"ticket_id" uuid,
	"prompt_id" uuid,
	"external_id" varchar(120),
	"model" varchar(160) NOT NULL,
	"provider" varchar(160) NOT NULL,
	"validation_status" "trace_validation_status" NOT NULL,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"retrieved_source_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tool_calls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"latency_ms" integer,
	"cost_usd" numeric(10, 6),
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"external_id" varchar(120),
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_csm_user_id_users_id_fk" FOREIGN KEY ("csm_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_trace_id_traces_id_fk" FOREIGN KEY ("trace_id") REFERENCES "public"."traces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_requested_by_user_id_users_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_knowledge_source_id_knowledge_sources_id_fk" FOREIGN KEY ("knowledge_source_id") REFERENCES "public"."knowledge_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evals" ADD CONSTRAINT "evals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evals" ADD CONSTRAINT "evals_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_sources" ADD CONSTRAINT "knowledge_sources_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_sources" ADD CONSTRAINT "knowledge_sources_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traces" ADD CONSTRAINT "traces_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traces" ADD CONSTRAINT "traces_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traces" ADD CONSTRAINT "traces_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_tenant_region_idx" ON "accounts" USING btree ("tenant_id","region");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_tenant_external_id_unique" ON "accounts" USING btree ("tenant_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_tenant_name_unique" ON "accounts" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "approvals_tenant_status_idx" ON "approvals" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "approvals_ticket_idx" ON "approvals" USING btree ("ticket_id");--> statement-breakpoint
CREATE UNIQUE INDEX "approvals_tenant_external_id_unique" ON "approvals" USING btree ("tenant_id","external_id");--> statement-breakpoint
CREATE INDEX "audit_events_tenant_occurred_at_idx" ON "audit_events" USING btree ("tenant_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "chunks_tenant_source_idx" ON "chunks" USING btree ("tenant_id","knowledge_source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "chunks_source_ordinal_unique" ON "chunks" USING btree ("knowledge_source_id","ordinal");--> statement-breakpoint
CREATE INDEX "evals_tenant_started_at_idx" ON "evals" USING btree ("tenant_id","started_at");--> statement-breakpoint
CREATE INDEX "evals_tenant_status_idx" ON "evals" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "evals_tenant_external_id_unique" ON "evals" USING btree ("tenant_id","external_id");--> statement-breakpoint
CREATE INDEX "knowledge_sources_tenant_topic_idx" ON "knowledge_sources" USING btree ("tenant_id","topic");--> statement-breakpoint
CREATE INDEX "knowledge_sources_tenant_status_idx" ON "knowledge_sources" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_sources_tenant_external_id_unique" ON "knowledge_sources" USING btree ("tenant_id","external_id");--> statement-breakpoint
CREATE INDEX "messages_ticket_sent_at_idx" ON "messages" USING btree ("ticket_id","sent_at");--> statement-breakpoint
CREATE INDEX "prompts_tenant_status_idx" ON "prompts" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "prompts_tenant_key_version_unique" ON "prompts" USING btree ("tenant_id","key","version");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_slug_unique" ON "tenants" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tickets_tenant_status_idx" ON "tickets" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "tickets_tenant_priority_idx" ON "tickets" USING btree ("tenant_id","priority");--> statement-breakpoint
CREATE INDEX "tickets_account_idx" ON "tickets" USING btree ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tickets_tenant_external_id_unique" ON "tickets" USING btree ("tenant_id","external_id");--> statement-breakpoint
CREATE INDEX "traces_tenant_started_at_idx" ON "traces" USING btree ("tenant_id","started_at");--> statement-breakpoint
CREATE INDEX "traces_ticket_idx" ON "traces" USING btree ("ticket_id");--> statement-breakpoint
CREATE UNIQUE INDEX "traces_tenant_external_id_unique" ON "traces" USING btree ("tenant_id","external_id");--> statement-breakpoint
CREATE INDEX "users_tenant_role_idx" ON "users" USING btree ("tenant_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "users_tenant_email_unique" ON "users" USING btree ("tenant_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_tenant_external_id_unique" ON "users" USING btree ("tenant_id","external_id");
