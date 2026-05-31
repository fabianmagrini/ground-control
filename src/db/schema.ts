import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "support_manager",
  "support_agent",
  "billing_ops",
  "engineering",
  "trust",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", ["P1", "P2", "P3"]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "Open",
  "Pending customer",
  "Waiting on Engineering",
  "Resolved",
]);

export const planEnum = pgEnum("plan", ["Premium", "Enterprise"]);
export const riskEnum = pgEnum("risk", ["Low", "Medium", "High"]);
export const messageRoleEnum = pgEnum("message_role", ["agent", "customer"]);
export const approvalStatusEnum = pgEnum("approval_status", [
  "Awaiting review",
  "Approved",
  "Rejected",
]);
export const traceValidationStatusEnum = pgEnum("trace_validation_status", [
  "Pass",
  "Needs review",
  "Blocked",
]);
export const promptStatusEnum = pgEnum("prompt_status", [
  "draft",
  "active",
  "retired",
]);
export const evalStatusEnum = pgEnum("eval_status", ["Pass", "Watch", "Failed"]);
export const knowledgeSourceStatusEnum = pgEnum("knowledge_source_status", [
  "draft",
  "published",
  "archived",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull(),
  name: text("name").notNull(),
  region: varchar("region", { length: 80 }).notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("tenants_slug_unique").on(table.slug),
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  externalId: varchar("external_id", { length: 120 }),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  ...timestamps,
}, (table) => [
  index("users_tenant_role_idx").on(table.tenantId, table.role),
  uniqueIndex("users_tenant_email_unique").on(table.tenantId, table.email),
  uniqueIndex("users_tenant_external_id_unique").on(table.tenantId, table.externalId),
]);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  externalId: varchar("external_id", { length: 120 }),
  name: text("name").notNull(),
  plan: planEnum("plan").notNull(),
  arr: varchar("arr", { length: 80 }).notNull(),
  health: integer("health").notNull(),
  region: varchar("region", { length: 80 }).notNull(),
  csmUserId: uuid("csm_user_id").references(() => users.id, { onDelete: "set null" }),
  renewal: varchar("renewal", { length: 120 }).notNull(),
  incidents: text("incidents").notNull(),
  contract: text("contract").notNull(),
  dataResidency: varchar("data_residency", { length: 120 }).notNull(),
  ...timestamps,
}, (table) => [
  index("accounts_tenant_region_idx").on(table.tenantId, table.region),
  uniqueIndex("accounts_tenant_external_id_unique").on(table.tenantId, table.externalId),
  uniqueIndex("accounts_tenant_name_unique").on(table.tenantId, table.name),
]);

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  externalId: varchar("external_id", { length: 120 }).notNull(),
  title: text("title").notNull(),
  priority: ticketPriorityEnum("priority").notNull(),
  sla: varchar("sla", { length: 80 }).notNull(),
  status: ticketStatusEnum("status").notNull(),
  sentiment: varchar("sentiment", { length: 120 }).notNull(),
  impact: text("impact").notNull(),
  risk: riskEnum("risk").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  ...timestamps,
}, (table) => [
  index("tickets_tenant_status_idx").on(table.tenantId, table.status),
  index("tickets_tenant_priority_idx").on(table.tenantId, table.priority),
  index("tickets_account_idx").on(table.accountId),
  uniqueIndex("tickets_tenant_external_id_unique").on(table.tenantId, table.externalId),
]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id").references(() => users.id, { onDelete: "set null" }),
  senderName: text("sender_name").notNull(),
  role: messageRoleEnum("role").notNull(),
  body: text("body").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull(),
  ...timestamps,
}, (table) => [
  index("messages_ticket_sent_at_idx").on(table.ticketId, table.sentAt),
]);

export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 120 }).notNull(),
  version: varchar("version", { length: 80 }).notNull(),
  status: promptStatusEnum("status").notNull().default("draft"),
  model: varchar("model", { length: 160 }).notNull(),
  provider: varchar("provider", { length: 160 }).notNull(),
  systemText: text("system_text").notNull(),
  userTemplate: text("user_template").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  ...timestamps,
}, (table) => [
  index("prompts_tenant_status_idx").on(table.tenantId, table.status),
  uniqueIndex("prompts_tenant_key_version_unique").on(table.tenantId, table.key, table.version),
]);

export const traces = pgTable("traces", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  ticketId: uuid("ticket_id").references(() => tickets.id, { onDelete: "set null" }),
  promptId: uuid("prompt_id").references(() => prompts.id, { onDelete: "set null" }),
  externalId: varchar("external_id", { length: 120 }),
  model: varchar("model", { length: 160 }).notNull(),
  provider: varchar("provider", { length: 160 }).notNull(),
  validationStatus: traceValidationStatusEnum("validation_status").notNull(),
  steps: jsonb("steps").$type<Array<{ title: string; body: string }>>().notNull().default([]),
  retrievedSourceIds: jsonb("retrieved_source_ids").$type<string[]>().notNull().default([]),
  toolCalls: jsonb("tool_calls").$type<Array<Record<string, unknown>>>().notNull().default([]),
  latencyMs: integer("latency_ms"),
  costUsd: numeric("cost_usd", { precision: 10, scale: 6 }),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("traces_tenant_started_at_idx").on(table.tenantId, table.startedAt),
  index("traces_ticket_idx").on(table.ticketId),
  uniqueIndex("traces_tenant_external_id_unique").on(table.tenantId, table.externalId),
]);

export const approvals = pgTable("approvals", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  traceId: uuid("trace_id").references(() => traces.id, { onDelete: "set null" }),
  externalId: varchar("external_id", { length: 120 }),
  requestedByUserId: uuid("requested_by_user_id").references(() => users.id, { onDelete: "set null" }),
  reviewedByUserId: uuid("reviewed_by_user_id").references(() => users.id, { onDelete: "set null" }),
  risk: riskEnum("risk").notNull(),
  reason: text("reason").notNull(),
  status: approvalStatusEnum("status").notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("approvals_tenant_status_idx").on(table.tenantId, table.status),
  index("approvals_ticket_idx").on(table.ticketId),
  uniqueIndex("approvals_tenant_external_id_unique").on(table.tenantId, table.externalId),
]);

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  actorName: text("actor_name").notNull(),
  event: text("event").notNull(),
  entityType: varchar("entity_type", { length: 80 }),
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  ...timestamps,
}, (table) => [
  index("audit_events_tenant_occurred_at_idx").on(table.tenantId, table.occurredAt),
  index("audit_events_entity_idx").on(table.entityType, table.entityId),
]);

export const evals = pgTable("evals", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  promptId: uuid("prompt_id").references(() => prompts.id, { onDelete: "set null" }),
  externalId: varchar("external_id", { length: 120 }),
  name: text("name").notNull(),
  promptVersion: varchar("prompt_version", { length: 80 }).notNull(),
  status: evalStatusEnum("status").notNull(),
  score: integer("score").notNull(),
  threshold: integer("threshold").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  ...timestamps,
}, (table) => [
  index("evals_tenant_started_at_idx").on(table.tenantId, table.startedAt),
  index("evals_tenant_status_idx").on(table.tenantId, table.status),
  uniqueIndex("evals_tenant_external_id_unique").on(table.tenantId, table.externalId),
]);

export const knowledgeSources = pgTable("knowledge_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  externalId: varchar("external_id", { length: 120 }).notNull(),
  title: text("title").notNull(),
  topic: varchar("topic", { length: 120 }).notNull(),
  freshness: varchar("freshness", { length: 120 }).notNull(),
  accessPolicy: text("access_policy").notNull(),
  ownerUserId: uuid("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  ownerName: text("owner_name").notNull(),
  body: text("body").notNull(),
  status: knowledgeSourceStatusEnum("status").notNull().default("draft"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("knowledge_sources_tenant_topic_idx").on(table.tenantId, table.topic),
  index("knowledge_sources_tenant_status_idx").on(table.tenantId, table.status),
  uniqueIndex("knowledge_sources_tenant_external_id_unique").on(table.tenantId, table.externalId),
]);

export const chunks = pgTable("chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  knowledgeSourceId: uuid("knowledge_source_id").notNull().references(() => knowledgeSources.id, {
    onDelete: "cascade",
  }),
  ordinal: integer("ordinal").notNull(),
  content: text("content").notNull(),
  embeddingModel: varchar("embedding_model", { length: 160 }),
  embedding: vector("embedding", { dimensions: 1536 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  ...timestamps,
}, (table) => [
  index("chunks_tenant_source_idx").on(table.tenantId, table.knowledgeSourceId),
  uniqueIndex("chunks_source_ordinal_unique").on(table.knowledgeSourceId, table.ordinal),
]);
