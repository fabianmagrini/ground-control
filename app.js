const initialTickets = [
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
        text:
          "We rotated our SAML certificate this morning and now most users cannot sign in. Admin access still works, but normal users are getting an invalid signature error.",
      },
      {
        sender: "Agent",
        role: "agent",
        time: "09:18",
        text:
          "Thanks for the detail. Please send the metadata URL and confirm whether the old signing certificate is still present in your IdP configuration.",
      },
      {
        sender: "Customer",
        role: "customer",
        time: "09:26",
        text:
          "The old cert was removed immediately after upload. We can re-add it if needed, but we need guidance before the next login wave starts.",
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
        text:
          "We received two invoices for the April renewal and both appear as paid in the portal. Can you reverse one of them today?",
      },
      {
        sender: "Agent",
        role: "agent",
        time: "10:21",
        text:
          "I am checking the invoice records and payment status now. Could you confirm whether your finance team has opened a chargeback?",
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
        text:
          "Our migration job is hitting API rate limits on the orders endpoint. We need a temporary increase from 600 to 1,500 requests per minute for the next 48 hours.",
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
        text:
          "The compliance export failed three times since we changed retention from 90 days to 7 years. The job reaches 74 percent and then fails with a storage quota warning.",
      },
    ],
  },
];

const knowledgeBase = [
  {
    id: "KB-102",
    title: "Enterprise SSO certificate rotation",
    topic: "Identity",
    freshness: "Updated 9 days ago",
    access: "Enterprise support",
    owner: "Identity PM",
    body:
      "Enterprise customers can rotate SAML signing certificates without downtime by uploading the new certificate, validating metadata, and keeping the old certificate active for 24 hours.",
  },
  {
    id: "KB-147",
    title: "Refund exception policy for duplicate billing",
    topic: "Billing",
    freshness: "Updated 18 days ago",
    access: "Billing operations",
    owner: "Billing Ops",
    body:
      "Duplicate invoices caused by platform errors are eligible for expedited reversal. Support agents should verify invoice IDs, confirm no chargeback is open, and route to Billing Ops.",
  },
  {
    id: "KB-221",
    title: "Data export SLA and retry windows",
    topic: "Exports",
    freshness: "Updated 3 days ago",
    access: "Enterprise support",
    owner: "Data Platform",
    body:
      "Workspace exports larger than 25 GB may take up to 8 hours. Failed exports should be retried once after checking object storage quota and workspace retention settings.",
  },
  {
    id: "KB-303",
    title: "Priority response commitments",
    topic: "Support",
    freshness: "Updated 27 days ago",
    access: "All support",
    owner: "Support Ops",
    body:
      "Premium plan customers receive a 2 hour first-response SLA for priority 1 issues and 8 hour first-response SLA for priority 2 issues. Enterprise accounts may have custom terms.",
  },
  {
    id: "KB-418",
    title: "API rate limit increase workflow",
    topic: "Platform",
    freshness: "Updated 11 days ago",
    access: "Platform support",
    owner: "API Platform",
    body:
      "Temporary API rate limit increases can be granted for migrations. Agents must capture the target endpoint, requested limit, duration, and migration window before escalation.",
  },
  {
    id: "KB-520",
    title: "Sensitive customer data handling",
    topic: "Governance",
    freshness: "Updated 2 days ago",
    access: "All support",
    owner: "Trust",
    body:
      "Generated replies must not include credentials, tokens, payment card details, protected health information, or unverified commitments. Risky replies require human approval.",
  },
];

const tools = [
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

const policies = [
  {
    title: "Permission-aware retrieval",
    state: true,
    detail: "Every source is filtered by account, region, entitlement, and support role.",
  },
  {
    title: "Prompt-injection isolation",
    state: true,
    detail: "Customer text is treated as untrusted context and cannot alter system policies.",
  },
  {
    title: "Human approval for external actions",
    state: true,
    detail: "Generated replies and workflow actions require an agent approval event.",
  },
  {
    title: "Sensitive data redaction",
    state: true,
    detail: "Drafts are checked for credentials, payment data, and unsupported promises.",
  },
];

const evals = [
  { name: "Grounded answer citations", score: 96, threshold: 92, status: "Pass" },
  { name: "Prompt injection resistance", score: 91, threshold: 90, status: "Pass" },
  { name: "Tool schema compliance", score: 99, threshold: 97, status: "Pass" },
  { name: "SLA escalation correctness", score: 87, threshold: 90, status: "Watch" },
];

const gateway = [
  { label: "Primary model", value: "general-low-latency", sub: "99.93% availability" },
  { label: "Fallback model", value: "general-safe", sub: "Enabled for provider errors" },
  { label: "Median latency", value: "1.42 s", sub: "Last 24 hours" },
  { label: "Cost per case", value: "$0.038", sub: "Summarize + retrieve + draft" },
];

const ingestionSteps = [
  ["Parse", "PDF, HTML, and ticket macros normalized into text blocks."],
  ["Classify", "Sources tagged by topic, owner, freshness, and access policy."],
  ["Chunk", "Content split into retrieval units with source anchors."],
  ["Embed", "Vectors generated and stored alongside exact-search metadata."],
  ["Evaluate", "Golden questions validate recall before publishing."],
];

let tickets = structuredClone(initialTickets);
let activeTicket = tickets[0];
let retrievedSources = [];
let draft = "";
let trace = [];
let auditEvents = [
  {
    time: "08:44",
    actor: "System",
    event: "Knowledge source KB-520 published after eval pass.",
  },
];
let approvals = [
  {
    id: "APR-902",
    ticketId: "TCK-4821",
    customer: "Northstar Analytics",
    risk: "High",
    reason: "P1 incident and custom SSO SLA",
    status: "Awaiting review",
  },
];

const els = {
  sectionEyebrow: document.querySelector("#section-eyebrow"),
  sectionTitle: document.querySelector("#section-title"),
  ticketList: document.querySelector("#ticket-list"),
  ticketCount: document.querySelector("#ticket-count"),
  approvalCount: document.querySelector("#approval-count"),
  knowledgeCount: document.querySelector("#knowledge-count"),
  evalHealth: document.querySelector("#eval-health"),
  ticketTitle: document.querySelector("#section-title"),
  customerName: document.querySelector("#customer-name"),
  ticketStatus: document.querySelector("#ticket-status"),
  ticketPriority: document.querySelector("#ticket-priority"),
  ticketPlan: document.querySelector("#ticket-plan"),
  ticketSla: document.querySelector("#ticket-sla"),
  ticketArr: document.querySelector("#ticket-arr"),
  riskStrip: document.querySelector("#risk-strip"),
  messageThread: document.querySelector("#message-thread"),
  summaryText: document.querySelector("#summary-text"),
  actionText: document.querySelector("#action-text"),
  sourceList: document.querySelector("#source-list"),
  draftText: document.querySelector("#draft-text"),
  confidenceScore: document.querySelector("#confidence-score"),
  replyBox: document.querySelector("#reply-box"),
  layerStack: document.querySelector("#layer-stack"),
  knowledgeList: document.querySelector("#knowledge-list"),
  knowledgeQuery: document.querySelector("#knowledge-query"),
  toolList: document.querySelector("#tool-list"),
  auditList: document.querySelector("#audit-list"),
  accountCard: document.querySelector("#account-card"),
  metricRow: document.querySelector("#metric-row"),
  queueFilter: document.querySelector("#queue-filter"),
  approvalGrid: document.querySelector("#approval-grid"),
  opsMetricRow: document.querySelector("#ops-metric-row"),
  evalList: document.querySelector("#eval-list"),
  gatewayList: document.querySelector("#gateway-list"),
  policyList: document.querySelector("#policy-list"),
  architectureMap: document.querySelector("#architecture-map"),
  ingestionSteps: document.querySelector("#ingestion-steps"),
};

function addAudit(actor, event) {
  auditEvents.unshift({
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    actor,
    event,
  });
  renderAudit();
}

function setSection(section) {
  document.querySelectorAll(".section-view").forEach((view) => view.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.querySelector(`#${section}-section`).classList.add("active");
  document.querySelector(`[data-section="${section}"]`).classList.add("active");

  const titles = {
    support: ["Support Desk", activeTicket.title],
    approvals: ["Human Review", "Approval Queue"],
    knowledge: ["Knowledge Operations", "Sources, Freshness, and Access"],
    observability: ["AI Operations", "Observability and Evaluation"],
    governance: ["Governance", "Controls and Architecture"],
  };
  els.sectionEyebrow.textContent = titles[section][0];
  els.sectionTitle.textContent = titles[section][1];
}

function queueTickets() {
  const filter = els.queueFilter.value;
  return tickets.filter((ticket) => {
    if (filter === "all") return true;
    if (filter === "Enterprise") return ticket.plan === "Enterprise";
    if (filter === "Pending customer") return ticket.status === "Pending customer";
    return ticket.priority === filter;
  });
}

function renderMetrics() {
  const open = tickets.filter((ticket) => ticket.status !== "Resolved").length;
  const p1 = tickets.filter((ticket) => ticket.priority === "P1").length;
  const atRisk = tickets.filter((ticket) => ticket.risk === "High").length;
  const enterprise = tickets.filter((ticket) => ticket.plan === "Enterprise").length;
  const metrics = [
    ["Open cases", open, "Across assigned queues"],
    ["P1 incidents", p1, "Require active ownership"],
    ["At-risk accounts", atRisk, "High renewal or SLA risk"],
    ["Enterprise cases", enterprise, "Custom terms may apply"],
  ];
  els.metricRow.innerHTML = metrics
    .map(
      ([label, value, sub]) => `
        <div class="metric-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${sub}</p>
        </div>
      `,
    )
    .join("");
}

function renderTickets() {
  els.ticketCount.textContent = tickets.length;
  els.ticketList.innerHTML = queueTickets()
    .map(
      (ticket) => `
        <button class="ticket-card ${ticket.id === activeTicket.id ? "active" : ""}" data-ticket-id="${ticket.id}" type="button">
          <span class="ticket-meta">${ticket.id} / ${ticket.priority} / ${ticket.sla}</span>
          <strong>${ticket.title}</strong>
          <span>${ticket.customer} / ${ticket.plan} / ${ticket.status}</span>
        </button>
      `,
    )
    .join("");
}

function renderTicket() {
  els.sectionTitle.textContent = activeTicket.title;
  els.customerName.textContent = activeTicket.customer;
  els.ticketStatus.textContent = activeTicket.status;
  els.ticketPriority.textContent = activeTicket.priority;
  els.ticketPlan.textContent = activeTicket.plan;
  els.ticketSla.textContent = activeTicket.sla;
  els.ticketArr.textContent = activeTicket.arr;
  els.replyBox.value = "";
  els.riskStrip.innerHTML = [
    ["Health", `${activeTicket.health}/100`],
    ["Sentiment", activeTicket.sentiment],
    ["Impact", activeTicket.impact],
    ["Region", activeTicket.region],
    ["Risk", activeTicket.risk],
  ]
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  els.messageThread.innerHTML = activeTicket.messages
    .map(
      (message) => `
        <div class="message ${message.role}">
          <div class="message-header">
            <span>${message.sender}</span>
            <span>${message.time}</span>
          </div>
          <p>${message.text}</p>
        </div>
      `,
    )
    .join("");
  renderAccount();
}

function resetCopilot() {
  retrievedSources = [];
  draft = "";
  trace = [
    {
      title: "Waiting for request",
      body: "The intelligence layer has not processed this ticket yet.",
    },
  ];
  els.summaryText.textContent =
    "Run Copilot to summarize the issue, retrieve policy context, and draft a response.";
  els.actionText.textContent = "No action suggested yet.";
  els.draftText.textContent = "No draft generated yet.";
  els.confidenceScore.textContent = "Idle";
  renderSources();
  renderTrace();
}

function scoreKnowledge(ticket, document) {
  const haystack = `${document.title} ${document.topic} ${document.body}`.toLowerCase();
  return ticket.keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}

function retrieveSources() {
  retrievedSources = knowledgeBase
    .map((doc) => ({ ...doc, score: scoreKnowledge(activeTicket, doc) }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!retrievedSources.find((source) => source.id === "KB-520")) {
    retrievedSources.push({ ...knowledgeBase.find((source) => source.id === "KB-520"), score: 1 });
  }

  trace = [
    {
      title: "Request received",
      body: `Ticket ${activeTicket.id}, role Support Lead, actions summarize + retrieve + draft + validate.`,
    },
    {
      title: "Entitlement and policy check",
      body: `${activeTicket.plan} plan confirmed. ${activeTicket.account.contract} and ${activeTicket.account.dataResidency} residency rules applied.`,
    },
    {
      title: "Context builder",
      body: `Loaded ${activeTicket.messages.length} messages, account health, SLA, contract terms, region, and ${retrievedSources.length} approved sources.`,
    },
    {
      title: "Retrieval",
      body: `Hybrid search returned ${retrievedSources.map((source) => source.id).join(", ")} with access filters and source anchors.`,
    },
  ];
}

function createSummary() {
  if (activeTicket.id === "TCK-4821") {
    return "Northstar rotated its SAML signing certificate and removed the old certificate, causing invalid signature errors for standard users. Admin access still works, so the likely fix is a zero-downtime certificate overlap and metadata validation.";
  }
  if (activeTicket.id === "TCK-4824") {
    return "Beacon Health appears to have two paid April renewal invoices. The agent should verify invoice IDs, confirm no chargeback is open, and route the duplicate charge through expedited reversal.";
  }
  if (activeTicket.id === "TCK-4833") {
    return "CivicCloud exports began failing after a retention change increased the export footprint. The failure pattern points to storage quota or object retention settings, with compliance timing risk because renewal is close.";
  }
  return "Omni Retail is blocked by API throttling during a migration. The request is eligible for structured escalation after confirming endpoint, target limit, duration, and migration window.";
}

function createAction() {
  if (activeTicket.id === "TCK-4821") {
    return "Ask the customer to re-add the old certificate for 24 hours, validate the new metadata, monitor SSO login success, and keep the incident in P1 watch.";
  }
  if (activeTicket.id === "TCK-4824") {
    return "Collect both invoice IDs and payment references, confirm no chargeback, then escalate to Billing Ops for expedited reversal.";
  }
  if (activeTicket.id === "TCK-4833") {
    return "Escalate to Data Platform with retention setting, export size, storage quota, and failure timestamp. Avoid promising completion until quota is confirmed.";
  }
  return "Capture endpoint, requested rate, duration, and migration window, then create a Platform escalation for temporary rate limit approval.";
}

function createDraft() {
  const citations = retrievedSources.map((source) => `[${source.id}]`).join(" ");
  if (activeTicket.id === "TCK-4821") {
    return `Thanks for confirming the old certificate was removed. Please re-add the previous SAML signing certificate and keep both certificates active for the next 24 hours while we validate the new metadata. That overlap should prevent invalid signature errors during propagation. I will keep this in P1 watch and monitor the SLA while you make the change. ${citations}`;
  }
  if (activeTicket.id === "TCK-4824") {
    return `Thanks for flagging this. I can route this as an expedited duplicate-billing reversal. Please send both invoice IDs and confirm whether your finance team has opened a chargeback. Once confirmed, I will attach the payment records and escalate to Billing Ops. ${citations}`;
  }
  if (activeTicket.id === "TCK-4833") {
    return `Thanks for the export details. I am escalating this with the retention change, failure point, and storage quota warning. Before we retry again, we should confirm the workspace quota and retention settings so we do not repeat the same failure. I will update you as soon as Engineering confirms the next safe retry window. ${citations}`;
  }
  return `Thanks for the migration details. To request the temporary increase, I need to confirm the endpoint, target limit, duration, and exact migration window. I have the orders endpoint, 1,500 requests per minute, and 48 hours; please send the migration start time and timezone so I can escalate this for approval. ${citations}`;
}

function runCopilot() {
  retrieveSources();
  draft = createDraft();
  trace.push(
    {
      title: "Model gateway",
      body: "Routed to general-low-latency with fallback enabled, temperature locked, and structured output schema.",
    },
    {
      title: "Guardrail validation",
      body: "Checked citations, unsupported commitments, sensitive data, and whether the response requires human approval.",
    },
  );
  els.summaryText.textContent = createSummary();
  els.actionText.textContent = createAction();
  els.draftText.textContent = draft;
  els.confidenceScore.textContent = activeTicket.risk === "High" ? "88% review" : "94% grounded";
  addAudit("Copilot", `Generated grounded assistance for ${activeTicket.id}.`);
  renderSources();
  renderTrace();
}

function renderSources() {
  els.sourceList.innerHTML =
    retrievedSources.length === 0
      ? '<p class="muted">No sources retrieved yet.</p>'
      : retrievedSources
          .map(
            (source) => `
              <div class="source-card">
                <strong>${source.id}: ${source.title}</strong>
                <span class="source-score">Match ${source.score ?? 1} / ${source.access}</span>
                <p>${source.body}</p>
              </div>
            `,
          )
          .join("");
}

function renderTrace() {
  els.layerStack.innerHTML = trace
    .map(
      (step, index) => `
        <div class="layer-card" data-step="${index + 1}">
          <strong>${step.title}</strong>
          <p>${step.body}</p>
        </div>
      `,
    )
    .join("");
}

function renderAccount() {
  const rows = [
    ["CSM", activeTicket.account.csm],
    ["Renewal", activeTicket.account.renewal],
    ["Incidents", activeTicket.account.incidents],
    ["Contract", activeTicket.account.contract],
    ["Residency", activeTicket.account.dataResidency],
  ];
  els.accountCard.innerHTML = `
    <div class="account-score">
      <strong>${activeTicket.health}</strong>
      <span>Account health</span>
    </div>
    ${rows.map(([label, value]) => `<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
  `;
}

function renderTools() {
  els.toolList.innerHTML = tools
    .map(
      (tool) => `
        <div class="tool-card">
          <div>
            <strong>${tool.name}</strong>
            <span>${tool.scope} / ${tool.status} / ${tool.latency}</span>
          </div>
          <p>${tool.description}</p>
        </div>
      `,
    )
    .join("");
}

function renderAudit() {
  els.auditList.innerHTML = auditEvents
    .map(
      (item) => `
        <div class="audit-item">
          <span>${item.time}</span>
          <strong>${item.actor}</strong>
          <p>${item.event}</p>
        </div>
      `,
    )
    .join("");
}

function renderKnowledge(filter = "") {
  const query = filter.trim().toLowerCase();
  const docs = knowledgeBase.filter((doc) =>
    `${doc.id} ${doc.title} ${doc.topic} ${doc.body} ${doc.owner}`.toLowerCase().includes(query),
  );
  els.knowledgeList.innerHTML = docs
    .map(
      (doc) => `
        <div class="knowledge-card">
          <div class="card-row">
            <strong>${doc.id}: ${doc.title}</strong>
            <span>${doc.freshness}</span>
          </div>
          <p>${doc.topic} / ${doc.access} / Owner: ${doc.owner}</p>
          <p>${doc.body}</p>
        </div>
      `,
    )
    .join("");
}

function renderApprovals() {
  els.approvalCount.textContent = approvals.filter((item) => item.status === "Awaiting review").length;
  els.approvalGrid.innerHTML = approvals
    .map(
      (approval) => `
        <div class="approval-card">
          <div class="card-row">
            <strong>${approval.id}</strong>
            <span class="risk-${approval.risk.toLowerCase()}">${approval.risk}</span>
          </div>
          <h4>${approval.customer}</h4>
          <p>${approval.ticketId} / ${approval.reason}</p>
          <div class="composer-actions">
            <button class="secondary-button" data-reject="${approval.id}" type="button">Reject</button>
            <button class="primary-button" data-approve="${approval.id}" type="button">Approve</button>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderOps() {
  const passCount = evals.filter((test) => test.status === "Pass").length;
  els.evalHealth.textContent = `${passCount}/${evals.length}`;
  els.opsMetricRow.innerHTML = [
    ["Eval pass rate", `${Math.round((passCount / evals.length) * 100)}%`, "Current prompt version"],
    ["Trace coverage", "100%", "All AI actions audited"],
    ["Fallback events", "3", "Last 24 hours"],
    ["Avg retrieval recall", "93%", "Golden set"],
  ]
    .map(
      ([label, value, sub]) => `
        <div class="metric-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${sub}</p>
        </div>
      `,
    )
    .join("");
  els.evalList.innerHTML = evals
    .map(
      (test) => `
        <div class="eval-row">
          <div>
            <strong>${test.name}</strong>
            <span>Threshold ${test.threshold}%</span>
          </div>
          <meter min="0" max="100" value="${test.score}"></meter>
          <b>${test.score}% ${test.status}</b>
        </div>
      `,
    )
    .join("");
  els.gatewayList.innerHTML = gateway
    .map(
      (item) => `
        <div class="gateway-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <p>${item.sub}</p>
        </div>
      `,
    )
    .join("");
}

function renderGovernance() {
  els.policyList.innerHTML = policies
    .map(
      (policy, index) => `
        <label class="policy-row">
          <input type="checkbox" ${policy.state ? "checked" : ""} data-policy="${index}" />
          <span>
            <strong>${policy.title}</strong>
            <p>${policy.detail}</p>
          </span>
        </label>
      `,
    )
    .join("");
  els.architectureMap.innerHTML = [
    ["Experience", "Support console, approvals, and AI assistant UX"],
    ["App API", "Tickets, accounts, entitlements, audit, workflow"],
    ["Intelligence Layer", "Context builder, tools, model gateway, guardrails"],
    ["Knowledge Layer", "Documents, vectors, metadata, access filters"],
    ["Operations", "Evals, traces, costs, feedback, regression gates"],
  ]
    .map(([layer, detail]) => `<div><strong>${layer}</strong><p>${detail}</p></div>`)
    .join("");
}

function renderIngestion() {
  els.ingestionSteps.innerHTML = ingestionSteps
    .map(([name, detail], index) => `<div class="pipeline-step" data-step="${index + 1}"><strong>${name}</strong><p>${detail}</p></div>`)
    .join("");
}

function updateCounts() {
  els.knowledgeCount.textContent = knowledgeBase.length;
  renderApprovals();
  renderOps();
}

document.addEventListener("click", (event) => {
  const sectionButton = event.target.closest("[data-section]");
  if (sectionButton) {
    setSection(sectionButton.dataset.section);
  }

  const ticketButton = event.target.closest("[data-ticket-id]");
  if (ticketButton) {
    activeTicket = tickets.find((ticket) => ticket.id === ticketButton.dataset.ticketId);
    renderTickets();
    renderTicket();
    resetCopilot();
    setSection("support");
  }

  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    tabButton.classList.add("active");
    document.querySelector(`#${tabButton.dataset.tab}-panel`).classList.add("active");
  }

  const approveId = event.target.closest("[data-approve]")?.dataset.approve;
  if (approveId) {
    approvals = approvals.map((approval) =>
      approval.id === approveId ? { ...approval, status: "Approved" } : approval,
    );
    addAudit("Reviewer", `Approved ${approveId}.`);
    renderApprovals();
  }

  const rejectId = event.target.closest("[data-reject]")?.dataset.reject;
  if (rejectId) {
    approvals = approvals.map((approval) =>
      approval.id === rejectId ? { ...approval, status: "Rejected" } : approval,
    );
    addAudit("Reviewer", `Rejected ${rejectId}.`);
    renderApprovals();
  }
});

document.querySelector("#run-copilot").addEventListener("click", runCopilot);
document.querySelector("#summarize").addEventListener("click", () => {
  retrieveSources();
  els.summaryText.textContent = createSummary();
  renderTrace();
});
document.querySelector("#find-policy").addEventListener("click", () => {
  retrieveSources();
  renderSources();
  renderTrace();
});
document.querySelector("#next-action").addEventListener("click", () => {
  els.actionText.textContent = createAction();
});
document.querySelector("#draft-reply").addEventListener("click", () => {
  if (retrievedSources.length === 0) retrieveSources();
  draft = createDraft();
  els.draftText.textContent = draft;
  renderSources();
  renderTrace();
});
document.querySelector("#insert-draft").addEventListener("click", () => {
  if (!draft) runCopilot();
  els.replyBox.value = draft;
  els.replyBox.focus();
});
document.querySelector("#approve-reply").addEventListener("click", () => {
  if (!els.replyBox.value.trim()) return;
  activeTicket.status = "Pending customer";
  trace.push({
    title: "Human approval",
    body: "Agent approved the editable draft. The application service would send the message and write an immutable audit event.",
  });
  approvals.push({
    id: `APR-${900 + approvals.length + 1}`,
    ticketId: activeTicket.id,
    customer: activeTicket.customer,
    risk: activeTicket.risk,
    reason: "Approved customer response with AI assistance",
    status: "Approved",
  });
  els.confidenceScore.innerHTML = '<span class="approved">Approved</span>';
  addAudit("Fabian", `Approved AI-assisted reply for ${activeTicket.id}.`);
  renderTrace();
  renderTickets();
  renderTicket();
  updateCounts();
});
document.querySelector("#escalate-ticket").addEventListener("click", () => {
  activeTicket.status = "Waiting on Engineering";
  approvals.push({
    id: `APR-${900 + approvals.length + 1}`,
    ticketId: activeTicket.id,
    customer: activeTicket.customer,
    risk: activeTicket.risk,
    reason: "Workflow tool createEscalation requires approval",
    status: "Awaiting review",
  });
  addAudit("Fabian", `Requested escalation approval for ${activeTicket.id}.`);
  renderTicket();
  renderTickets();
  renderApprovals();
});
document.querySelector("#bulk-approve").addEventListener("click", () => {
  approvals = approvals.map((approval) =>
    approval.risk === "High" ? approval : { ...approval, status: "Approved" },
  );
  addAudit("Reviewer", "Bulk approved low and medium risk items.");
  renderApprovals();
});
document.querySelector("#run-evals").addEventListener("click", () => {
  evals.forEach((test) => {
    test.score = Math.min(100, test.score + (test.status === "Watch" ? 4 : 1));
    test.status = test.score >= test.threshold ? "Pass" : "Watch";
  });
  addAudit("Eval Runner", "Regression suite completed for current prompt version.");
  renderOps();
});
document.querySelector("#reset-demo").addEventListener("click", () => {
  tickets = structuredClone(initialTickets);
  activeTicket = tickets[0];
  approvals = [
    {
      id: "APR-902",
      ticketId: "TCK-4821",
      customer: "Northstar Analytics",
      risk: "High",
      reason: "P1 incident and custom SSO SLA",
      status: "Awaiting review",
    },
  ];
  auditEvents = [
    {
      time: "08:44",
      actor: "System",
      event: "Knowledge source KB-520 published after eval pass.",
    },
  ];
  renderAll();
  resetCopilot();
  setSection("support");
});
els.queueFilter.addEventListener("change", renderTickets);
els.knowledgeQuery.addEventListener("input", (event) => renderKnowledge(event.target.value));

function renderAll() {
  renderMetrics();
  renderTickets();
  renderTicket();
  renderKnowledge();
  renderTools();
  renderAudit();
  renderApprovals();
  renderOps();
  renderGovernance();
  renderIngestion();
  updateCounts();
}

renderAll();
resetCopilot();
setSection("support");
