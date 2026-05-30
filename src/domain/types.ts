export type Section =
  | "support"
  | "approvals"
  | "knowledge"
  | "observability"
  | "governance";

export type Priority = "P1" | "P2" | "P3";

export type TicketStatus =
  | "Open"
  | "Pending customer"
  | "Waiting on Engineering"
  | "Resolved";

export type Risk = "Low" | "Medium" | "High";

export type Message = {
  sender: string;
  role: "agent" | "customer";
  time: string;
  text: string;
};

export type AccountContext = {
  csm: string;
  renewal: string;
  incidents: string;
  contract: string;
  dataResidency: string;
};

export type Ticket = {
  id: string;
  customer: string;
  title: string;
  priority: Priority;
  plan: "Premium" | "Enterprise";
  sla: string;
  status: TicketStatus;
  owner: string;
  arr: string;
  health: number;
  sentiment: string;
  impact: string;
  region: string;
  risk: Risk;
  keywords: string[];
  account: AccountContext;
  messages: Message[];
};

export type KnowledgeSource = {
  id: string;
  title: string;
  topic: string;
  freshness: string;
  access: string;
  owner: string;
  body: string;
};

export type RetrievedSource = KnowledgeSource & {
  score: number;
};

export type ToolDefinition = {
  name: string;
  scope: string;
  status: string;
  latency: string;
  description: string;
};

export type TraceStep = {
  title: string;
  body: string;
};

export type AuditEvent = {
  time: string;
  actor: string;
  event: string;
};

export type Approval = {
  id: string;
  ticketId: string;
  customer: string;
  risk: Risk;
  reason: string;
  status: "Awaiting review" | "Approved" | "Rejected";
};

export type EvalCase = {
  name: string;
  score: number;
  threshold: number;
  status: "Pass" | "Watch";
};

export type GatewayMetric = {
  label: string;
  value: string;
  sub: string;
};
