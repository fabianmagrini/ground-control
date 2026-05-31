import { z } from "zod";

export const sectionSchema = z.enum([
  "support",
  "approvals",
  "knowledge",
  "observability",
  "governance",
]);

export const prioritySchema = z.enum(["P1", "P2", "P3"]);
export const ticketStatusSchema = z.enum([
  "Open",
  "Pending customer",
  "Waiting on Engineering",
  "Resolved",
]);
export const riskSchema = z.enum(["Low", "Medium", "High"]);

export const messageSchema = z.object({
  sender: z.string(),
  role: z.enum(["agent", "customer"]),
  time: z.string(),
  text: z.string(),
});

export const accountContextSchema = z.object({
  csm: z.string(),
  renewal: z.string(),
  incidents: z.string(),
  contract: z.string(),
  dataResidency: z.string(),
});

export const ticketSchema = z.object({
  id: z.string(),
  customer: z.string(),
  title: z.string(),
  priority: prioritySchema,
  plan: z.enum(["Premium", "Enterprise"]),
  sla: z.string(),
  status: ticketStatusSchema,
  owner: z.string(),
  arr: z.string(),
  health: z.number().min(0).max(100),
  sentiment: z.string(),
  impact: z.string(),
  region: z.string(),
  risk: riskSchema,
  keywords: z.array(z.string()),
  account: accountContextSchema,
  messages: z.array(messageSchema),
});

export const knowledgeSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  freshness: z.string(),
  access: z.string(),
  owner: z.string(),
  body: z.string(),
});

export const retrievedSourceSchema = knowledgeSourceSchema.extend({
  score: z.number(),
});

export const toolDefinitionSchema = z.object({
  name: z.string(),
  scope: z.string(),
  status: z.string(),
  latency: z.string(),
  description: z.string(),
});

export const toolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["Allowed", "Blocked", "Approval required", "Completed", "Failed"]),
  input: z.record(z.string(), z.unknown()),
  output: z.record(z.string(), z.unknown()).optional(),
  latencyMs: z.number().nonnegative().optional(),
});

export const traceStepSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const aiTraceSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  promptVersion: z.string(),
  model: z.string(),
  provider: z.string(),
  steps: z.array(traceStepSchema),
  retrievedSourceIds: z.array(z.string()),
  toolCalls: z.array(toolCallSchema),
  validationStatus: z.enum(["Pass", "Needs review", "Blocked"]),
});

export const auditEventSchema = z.object({
  time: z.string(),
  actor: z.string(),
  event: z.string(),
});

export const approvalSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  customer: z.string(),
  risk: riskSchema,
  reason: z.string(),
  status: z.enum(["Awaiting review", "Approved", "Rejected"]),
});

export const evalCaseSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  threshold: z.number().min(0).max(100),
  status: z.enum(["Pass", "Watch"]),
});

export const evalRunSchema = z.object({
  id: z.string(),
  promptVersion: z.string(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  cases: z.array(evalCaseSchema),
  status: z.enum(["Pass", "Watch", "Failed"]),
});

export const gatewayMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  sub: z.string(),
});

export const copilotRunRequestSchema = z.object({
  ticketId: z.string(),
  mode: z.enum(["summarize", "retrieve", "draft", "validate", "full"]).default("full"),
  actor: z.string(),
});

export const copilotRunResultSchema = z.object({
  ticketId: z.string(),
  summary: z.string(),
  action: z.string(),
  draft: z.string(),
  confidence: z.string(),
  sources: z.array(retrievedSourceSchema),
  trace: aiTraceSchema,
  auditEvent: auditEventSchema,
  approvalRequired: z.boolean(),
});

export type Section = z.infer<typeof sectionSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type Risk = z.infer<typeof riskSchema>;
export type Message = z.infer<typeof messageSchema>;
export type AccountContext = z.infer<typeof accountContextSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type KnowledgeSource = z.infer<typeof knowledgeSourceSchema>;
export type RetrievedSource = z.infer<typeof retrievedSourceSchema>;
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;
export type ToolCall = z.infer<typeof toolCallSchema>;
export type TraceStep = z.infer<typeof traceStepSchema>;
export type AiTrace = z.infer<typeof aiTraceSchema>;
export type AuditEvent = z.infer<typeof auditEventSchema>;
export type Approval = z.infer<typeof approvalSchema>;
export type EvalCase = z.infer<typeof evalCaseSchema>;
export type EvalRun = z.infer<typeof evalRunSchema>;
export type GatewayMetric = z.infer<typeof gatewayMetricSchema>;
export type CopilotRunRequest = z.infer<typeof copilotRunRequestSchema>;
export type CopilotRunResult = z.infer<typeof copilotRunResultSchema>;
