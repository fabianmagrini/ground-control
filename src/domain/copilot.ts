import { knowledgeBase } from "./fixtures";
import type { RetrievedSource, Ticket, TraceStep } from "./types";

function scoreKnowledge(ticket: Ticket, body: string) {
  const haystack = body.toLowerCase();
  return ticket.keywords.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0,
  );
}

export function retrieveSources(ticket: Ticket) {
  const sources = knowledgeBase
    .map((source) => ({
      ...source,
      score: scoreKnowledge(ticket, `${source.title} ${source.topic} ${source.body}`),
    }))
    .filter((source) => source.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!sources.some((source) => source.id === "KB-520")) {
    const governanceSource = knowledgeBase.find((source) => source.id === "KB-520");
    if (governanceSource) sources.push({ ...governanceSource, score: 1 });
  }

  const trace: TraceStep[] = [
    {
      title: "Request received",
      body: `Ticket ${ticket.id}, role Support Lead, actions summarize + retrieve + draft + validate.`,
    },
    {
      title: "Entitlement and policy check",
      body: `${ticket.plan} plan confirmed. ${ticket.account.contract} and ${ticket.account.dataResidency} residency rules applied.`,
    },
    {
      title: "Context builder",
      body: `Loaded ${ticket.messages.length} messages, account health, SLA, contract terms, region, and ${sources.length} approved sources.`,
    },
    {
      title: "Retrieval",
      body: `Hybrid search returned ${sources.map((source) => source.id).join(", ")} with access filters and source anchors.`,
    },
  ];

  return { sources, trace };
}

export function createSummary(ticket: Ticket) {
  if (ticket.id === "TCK-4821") {
    return "Northstar rotated its SAML signing certificate and removed the old certificate, causing invalid signature errors for standard users. Admin access still works, so the likely fix is a zero-downtime certificate overlap and metadata validation.";
  }
  if (ticket.id === "TCK-4824") {
    return "Beacon Health appears to have two paid April renewal invoices. The agent should verify invoice IDs, confirm no chargeback is open, and route the duplicate charge through expedited reversal.";
  }
  if (ticket.id === "TCK-4833") {
    return "CivicCloud exports began failing after a retention change increased the export footprint. The failure pattern points to storage quota or object retention settings, with compliance timing risk because renewal is close.";
  }
  return "Omni Retail is blocked by API throttling during a migration. The request is eligible for structured escalation after confirming endpoint, target limit, duration, and migration window.";
}

export function createAction(ticket: Ticket) {
  if (ticket.id === "TCK-4821") {
    return "Ask the customer to re-add the old certificate for 24 hours, validate the new metadata, monitor SSO login success, and keep the incident in P1 watch.";
  }
  if (ticket.id === "TCK-4824") {
    return "Collect both invoice IDs and payment references, confirm no chargeback, then escalate to Billing Ops for expedited reversal.";
  }
  if (ticket.id === "TCK-4833") {
    return "Escalate to Data Platform with retention setting, export size, storage quota, and failure timestamp. Avoid promising completion until quota is confirmed.";
  }
  return "Capture endpoint, requested rate, duration, and migration window, then create a Platform escalation for temporary rate limit approval.";
}

export function createDraft(ticket: Ticket, sources: RetrievedSource[]) {
  const citations = sources.map((source) => `[${source.id}]`).join(" ");
  if (ticket.id === "TCK-4821") {
    return `Thanks for confirming the old certificate was removed. Please re-add the previous SAML signing certificate and keep both certificates active for the next 24 hours while we validate the new metadata. That overlap should prevent invalid signature errors during propagation. I will keep this in P1 watch and monitor the SLA while you make the change. ${citations}`;
  }
  if (ticket.id === "TCK-4824") {
    return `Thanks for flagging this. I can route this as an expedited duplicate-billing reversal. Please send both invoice IDs and confirm whether your finance team has opened a chargeback. Once confirmed, I will attach the payment records and escalate to Billing Ops. ${citations}`;
  }
  if (ticket.id === "TCK-4833") {
    return `Thanks for the export details. I am escalating this with the retention change, failure point, and storage quota warning. Before we retry again, we should confirm the workspace quota and retention settings so we do not repeat the same failure. I will update you as soon as Engineering confirms the next safe retry window. ${citations}`;
  }
  return `Thanks for the migration details. To request the temporary increase, I need to confirm the endpoint, target limit, duration, and exact migration window. I have the orders endpoint, 1,500 requests per minute, and 48 hours; please send the migration start time and timezone so I can escalate this for approval. ${citations}`;
}
