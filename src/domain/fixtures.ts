import type {
  Approval,
  AuditEvent,
  EvalCase,
  GatewayMetric,
  KnowledgeSource,
  Ticket,
  ToolDefinition,
} from "./types";

export const initialTickets: Ticket[] = [
  {
    id: "TCK-4821",
    customer: "Northstar Analytics",
    title: "SAML login failing after certificate update",
    priority: "P1",
    plan: "Enterprise",
    sla: "1h 14m",
    status: "Open",
    owner: "Fabian",
    arr: "$1.8M",
    health: 72,
    sentiment: "Urgent",
    impact: "842 users affected",
    region: "APAC",
    risk: "High",
    keywords: ["saml", "certificate", "enterprise", "sso", "metadata", "login"],
    account: {
      csm: "Mina Patel",
      renewal: "46 days",
      incidents: "2 P1s this quarter",
      contract: "Custom SSO SLA",
      dataResidency: "Australia",
    },
    messages: [
      {
        sender: "Customer",
        role: "customer",
        time: "09:12",
        text: "We rotated our SAML certificate this morning and now most users cannot sign in. Admin access still works, but normal users are getting an invalid signature error.",
      },
      {
        sender: "Agent",
        role: "agent",
        time: "09:18",
        text: "Thanks for the detail. Please send the metadata URL and confirm whether the old signing certificate is still present in your IdP configuration.",
      },
      {
        sender: "Customer",
        role: "customer",
        time: "09:26",
        text: "The old cert was removed immediately after upload. We can re-add it if needed, but we need guidance before the next login wave starts.",
      },
    ],
  },
  {
    id: "TCK-4824",
    customer: "Beacon Health",
    title: "Duplicate invoice for April renewal",
    priority: "P2",
    plan: "Premium",
    sla: "5h 03m",
    status: "Open",
    owner: "Nadia",
    arr: "$420K",
    health: 81,
    sentiment: "Concerned",
    impact: "Finance close blocked",
    region: "US",
    risk: "Medium",
    keywords: ["invoice", "billing", "duplicate", "refund", "renewal", "chargeback"],
    account: {
      csm: "Elliot James",
      renewal: "112 days",
      incidents: "No P1s this quarter",
      contract: "Premium billing terms",
      dataResidency: "United States",
    },
    messages: [
      {
        sender: "Customer",
        role: "customer",
        time: "10:04",
        text: "We received two invoices for the April renewal and both appear as paid in the portal. Can you reverse one of them today?",
      },
      {
        sender: "Agent",
        role: "agent",
        time: "10:21",
        text: "I am checking the invoice records and payment status now. Could you confirm whether your finance team has opened a chargeback?",
      },
    ],
  },
  {
    id: "TCK-4830",
    customer: "Omni Retail Group",
    title: "API throttling during migration window",
    priority: "P2",
    plan: "Enterprise",
    sla: "7h 42m",
    status: "Open",
    owner: "Fabian",
    arr: "$980K",
    health: 76,
    sentiment: "Blocked",
    impact: "Migration delayed",
    region: "EMEA",
    risk: "Medium",
    keywords: ["api", "rate", "limit", "migration", "throttling", "orders"],
    account: {
      csm: "Jo Weber",
      renewal: "208 days",
      incidents: "1 P2 this quarter",
      contract: "Enterprise platform terms",
      dataResidency: "EU",
    },
    messages: [
      {
        sender: "Customer",
        role: "customer",
        time: "11:30",
        text: "Our migration job is hitting API rate limits on the orders endpoint. We need a temporary increase from 600 to 1,500 requests per minute for the next 48 hours.",
      },
    ],
  },
  {
    id: "TCK-4833",
    customer: "CivicCloud",
    title: "Export job repeatedly failing after retention policy change",
    priority: "P2",
    plan: "Enterprise",
    sla: "6h 10m",
    status: "Waiting on Engineering",
    owner: "Arun",
    arr: "$760K",
    health: 68,
    sentiment: "Escalated",
    impact: "Compliance export blocked",
    region: "US Gov",
    risk: "High",
    keywords: ["export", "retention", "quota", "object", "storage", "compliance"],
    account: {
      csm: "Helen Ortiz",
      renewal: "31 days",
      incidents: "Security review in progress",
      contract: "Gov cloud addendum",
      dataResidency: "United States",
    },
    messages: [
      {
        sender: "Customer",
        role: "customer",
        time: "12:02",
        text: "The compliance export failed three times since we changed retention from 90 days to 7 years. The job reaches 74 percent and then fails with a storage quota warning.",
      },
    ],
  },
];

export const knowledgeBase: KnowledgeSource[] = [
  {
    id: "KB-102",
    title: "Enterprise SSO certificate rotation",
    topic: "Identity",
    freshness: "Updated 9 days ago",
    access: "Enterprise support",
    owner: "Identity PM",
    body: "Enterprise customers can rotate SAML signing certificates without downtime by uploading the new certificate, validating metadata, and keeping the old certificate active for 24 hours.",
  },
  {
    id: "KB-147",
    title: "Refund exception policy for duplicate billing",
    topic: "Billing",
    freshness: "Updated 18 days ago",
    access: "Billing operations",
    owner: "Billing Ops",
    body: "Duplicate invoices caused by platform errors are eligible for expedited reversal. Support agents should verify invoice IDs, confirm no chargeback is open, and route to Billing Ops.",
  },
  {
    id: "KB-221",
    title: "Data export SLA and retry windows",
    topic: "Exports",
    freshness: "Updated 3 days ago",
    access: "Enterprise support",
    owner: "Data Platform",
    body: "Workspace exports larger than 25 GB may take up to 8 hours. Failed exports should be retried once after checking object storage quota and workspace retention settings.",
  },
  {
    id: "KB-303",
    title: "Priority response commitments",
    topic: "Support",
    freshness: "Updated 27 days ago",
    access: "All support",
    owner: "Support Ops",
    body: "Premium plan customers receive a 2 hour first-response SLA for priority 1 issues and 8 hour first-response SLA for priority 2 issues. Enterprise accounts may have custom terms.",
  },
  {
    id: "KB-418",
    title: "API rate limit increase workflow",
    topic: "Platform",
    freshness: "Updated 11 days ago",
    access: "Platform support",
    owner: "API Platform",
    body: "Temporary API rate limit increases can be granted for migrations. Agents must capture the target endpoint, requested limit, duration, and migration window before escalation.",
  },
  {
    id: "KB-520",
    title: "Sensitive customer data handling",
    topic: "Governance",
    freshness: "Updated 2 days ago",
    access: "All support",
    owner: "Trust",
    body: "Generated replies must not include credentials, tokens, payment card details, protected health information, or unverified commitments. Risky replies require human approval.",
  },
];

export const tools: ToolDefinition[] = [
  {
    name: "searchKnowledgeBase",
    scope: "Retrieval",
    status: "Allowed",
    latency: "84 ms",
    description: "Runs hybrid search against approved policy and troubleshooting content.",
  },
  {
    name: "checkEntitlements",
    scope: "Policy",
    status: "Required",
    latency: "31 ms",
    description: "Verifies account plan, custom SLA terms, data residency, and user permissions.",
  },
  {
    name: "createEscalation",
    scope: "Workflow",
    status: "Approval gated",
    latency: "112 ms",
    description: "Creates an escalation task with structured fields and audit metadata.",
  },
  {
    name: "draftCustomerReply",
    scope: "Generation",
    status: "Human review",
    latency: "1.2 s",
    description: "Produces an editable response grounded in ticket history and retrieved sources.",
  },
];

export const initialApprovals: Approval[] = [
  {
    id: "APR-902",
    ticketId: "TCK-4821",
    customer: "Northstar Analytics",
    risk: "High",
    reason: "P1 incident and custom SSO SLA",
    status: "Awaiting review",
  },
];

export const initialAuditEvents: AuditEvent[] = [
  {
    time: "08:44",
    actor: "System",
    event: "Knowledge source KB-520 published after eval pass.",
  },
];

export const evals: EvalCase[] = [
  { name: "Grounded answer citations", score: 96, threshold: 92, status: "Pass" },
  { name: "Prompt injection resistance", score: 91, threshold: 90, status: "Pass" },
  { name: "Tool schema compliance", score: 99, threshold: 97, status: "Pass" },
  { name: "SLA escalation correctness", score: 87, threshold: 90, status: "Watch" },
];

export const gateway: GatewayMetric[] = [
  { label: "Primary model", value: "general-low-latency", sub: "99.93% availability" },
  { label: "Fallback model", value: "general-safe", sub: "Enabled for provider errors" },
  { label: "Median latency", value: "1.42 s", sub: "Last 24 hours" },
  { label: "Cost per case", value: "$0.038", sub: "Summarize + retrieve + draft" },
];

export const ingestionSteps = [
  ["Parse", "PDF, HTML, and ticket macros normalized into text blocks."],
  ["Classify", "Sources tagged by topic, owner, freshness, and access policy."],
  ["Chunk", "Content split into retrieval units with source anchors."],
  ["Embed", "Vectors generated and stored alongside exact-search metadata."],
  ["Evaluate", "Golden questions validate recall before publishing."],
] as const;

export const policies = [
  ["Permission-aware retrieval", "Every source is filtered by account, region, entitlement, and support role."],
  ["Prompt-injection isolation", "Customer text is treated as untrusted context and cannot alter system policies."],
  ["Human approval for external actions", "Generated replies and workflow actions require an agent approval event."],
  ["Sensitive data redaction", "Drafts are checked for credentials, payment data, and unsupported promises."],
] as const;
