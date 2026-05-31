import postgres from "postgres";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/intelligence_ops";

const tenantSeed = {
  slug: "ground-control-demo",
  name: "Ground Control Demo",
  region: "global",
};

const tickets = [
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

const knowledgeSources = [
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

const evalCases = [
  { name: "Grounded answer citations", score: 96, threshold: 92, status: "Pass" },
  { name: "Prompt injection resistance", score: 91, threshold: 90, status: "Pass" },
  { name: "Tool schema compliance", score: 99, threshold: 97, status: "Pass" },
  { name: "SLA escalation correctness", score: 87, threshold: 90, status: "Watch" },
];

const sql = postgres(databaseUrl, {
  max: 1,
  prepare: false,
});

try {
  const summary = await sql.begin(async (tx) => {
    const existingTenants = await tx`
      select id from tenants where slug = ${tenantSeed.slug}
    `;

    if (existingTenants[0]) {
      await tx`
        delete from tenants where id = ${existingTenants[0].id}
      `;
    }

    const [tenant] = await tx`
      insert into tenants (slug, name, region)
      values (${tenantSeed.slug}, ${tenantSeed.name}, ${tenantSeed.region})
      returning id
    `;

    const userIds = new Map();
    const accountIds = new Map();
    const ticketIds = new Map();

    for (const name of collectUserNames()) {
      const [user] = await tx`
        insert into users (tenant_id, external_id, name, email, role)
        values (${tenant.id}, ${slugify(name)}, ${name}, ${emailFor(name)}, ${roleFor(name)})
        returning id
      `;
      userIds.set(name, user.id);
    }

    for (const ticket of tickets) {
      const [account] = await tx`
        insert into accounts (
          tenant_id,
          external_id,
          name,
          plan,
          arr,
          health,
          region,
          csm_user_id,
          renewal,
          incidents,
          contract,
          data_residency
        )
        values (
          ${tenant.id},
          ${slugify(ticket.customer)},
          ${ticket.customer},
          ${ticket.plan},
          ${ticket.arr},
          ${ticket.health},
          ${ticket.region},
          ${userIds.get(ticket.account.csm)},
          ${ticket.account.renewal},
          ${ticket.account.incidents},
          ${ticket.account.contract},
          ${ticket.account.dataResidency}
        )
        returning id
      `;

      accountIds.set(ticket.customer, account.id);

      const [ticketRow] = await tx`
        insert into tickets (
          tenant_id,
          account_id,
          owner_id,
          external_id,
          title,
          priority,
          sla,
          status,
          sentiment,
          impact,
          risk,
          keywords
        )
        values (
          ${tenant.id},
          ${account.id},
          ${userIds.get(ticket.owner)},
          ${ticket.id},
          ${ticket.title},
          ${ticket.priority},
          ${ticket.sla},
          ${ticket.status},
          ${ticket.sentiment},
          ${ticket.impact},
          ${ticket.risk},
          ${JSON.stringify(ticket.keywords)}
        )
        returning id
      `;

      ticketIds.set(ticket.id, ticketRow.id);

      for (const message of ticket.messages) {
        await tx`
          insert into messages (
            tenant_id,
            ticket_id,
            sender_name,
            role,
            body,
            sent_at
          )
          values (
            ${tenant.id},
            ${ticketRow.id},
            ${message.sender},
            ${message.role},
            ${message.text},
            ${messageDate(message.time)}
          )
        `;
      }
    }

    const [prompt] = await tx`
      insert into prompts (
        tenant_id,
        key,
        version,
        status,
        model,
        provider,
        system_text,
        user_template,
        metadata
      )
      values (
        ${tenant.id},
        ${"support-copilot"},
        ${"2026-05-31.demo"},
        ${"active"},
        ${"general-low-latency"},
        ${"prototype"},
        ${"Summarize, retrieve, draft, and validate support responses using approved sources."},
        ${"Ticket: {{ticketId}}. Mode: {{mode}}."},
        ${JSON.stringify({ seeded: true })}
      )
      returning id
    `;

    const [trace] = await tx`
      insert into traces (
        tenant_id,
        ticket_id,
        prompt_id,
        external_id,
        model,
        provider,
        validation_status,
        steps,
        retrieved_source_ids,
        tool_calls,
        latency_ms,
        cost_usd,
        completed_at
      )
      values (
        ${tenant.id},
        ${ticketIds.get("TCK-4821")},
        ${prompt.id},
        ${"TRACE-4821"},
        ${"general-low-latency"},
        ${"prototype"},
        ${"Pass"},
        ${JSON.stringify([
          { title: "Request received", body: "Seeded Copilot run for TCK-4821." },
          { title: "Retrieval", body: "Returned KB-102, KB-303, and KB-520." },
        ])},
        ${JSON.stringify(["KB-102", "KB-303", "KB-520"])},
        ${JSON.stringify([{ name: "searchKnowledgeBase", status: "Completed" }])},
        ${1420},
        ${"0.038000"},
        ${messageDate("09:31")}
      )
      returning id
    `;

    await tx`
      insert into approvals (
        tenant_id,
        ticket_id,
        trace_id,
        external_id,
        requested_by_user_id,
        risk,
        reason,
        status
      )
      values (
        ${tenant.id},
        ${ticketIds.get("TCK-4821")},
        ${trace.id},
        ${"APR-902"},
        ${userIds.get("Fabian")},
        ${"High"},
        ${"P1 incident and custom SSO SLA"},
        ${"Awaiting review"}
      )
    `;

    await tx`
      insert into audit_events (
        tenant_id,
        actor_name,
        event,
        entity_type,
        entity_id,
        metadata,
        occurred_at
      )
      values (
        ${tenant.id},
        ${"System"},
        ${"Knowledge source KB-520 published after eval pass."},
        ${"knowledge_source"},
        ${null},
        ${JSON.stringify({ sourceId: "KB-520", seeded: true })},
        ${messageDate("08:44")}
      )
    `;

    for (const evalCase of evalCases) {
      await tx`
        insert into evals (
          tenant_id,
          prompt_id,
          external_id,
          name,
          prompt_version,
          status,
          score,
          threshold,
          completed_at,
          metadata
        )
        values (
          ${tenant.id},
          ${prompt.id},
          ${slugify(evalCase.name)},
          ${evalCase.name},
          ${"2026-05-31.demo"},
          ${evalCase.status},
          ${evalCase.score},
          ${evalCase.threshold},
          ${messageDate("08:40")},
          ${JSON.stringify({ seeded: true })}
        )
      `;
    }

    for (const source of knowledgeSources) {
      const [knowledgeSource] = await tx`
        insert into knowledge_sources (
          tenant_id,
          external_id,
          title,
          topic,
          freshness,
          access_policy,
          owner_user_id,
          owner_name,
          body,
          status,
          published_at,
          metadata
        )
        values (
          ${tenant.id},
          ${source.id},
          ${source.title},
          ${source.topic},
          ${source.freshness},
          ${source.access},
          ${userIds.get(source.owner) ?? null},
          ${source.owner},
          ${source.body},
          ${"published"},
          ${messageDate("08:30")},
          ${JSON.stringify({ seeded: true })}
        )
        returning id
      `;

      await tx`
        insert into chunks (
          tenant_id,
          knowledge_source_id,
          ordinal,
          content,
          embedding_model,
          embedding,
          metadata
        )
        values (
          ${tenant.id},
          ${knowledgeSource.id},
          ${0},
          ${source.body},
          ${null},
          ${null},
          ${JSON.stringify({ sourceId: source.id, seeded: true })}
        )
      `;
    }

    return {
      tenant: tenantSeed.slug,
      users: userIds.size,
      accounts: accountIds.size,
      tickets: ticketIds.size,
      messages: tickets.reduce((count, ticket) => count + ticket.messages.length, 0),
      knowledgeSources: knowledgeSources.length,
      chunks: knowledgeSources.length,
      evals: evalCases.length,
      approvals: 1,
      traces: 1,
    };
  });

  console.log(`Seeded local data for tenant "${summary.tenant}".`);
  console.table(summary);
} catch (error) {
  console.error("Failed to seed local data.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await sql.end();
}

function collectUserNames() {
  return Array.from(
    new Set([
      ...tickets.flatMap((ticket) => [ticket.owner, ticket.account.csm]),
      ...knowledgeSources.map((source) => source.owner),
    ]),
  );
}

function emailFor(name) {
  return `${slugify(name)}@example.com`;
}

function roleFor(name) {
  if (name === "Trust") return "trust";
  if (name === "Billing Ops") return "billing_ops";
  if (["Data Platform", "API Platform", "Identity PM"].includes(name)) return "engineering";
  if (["Mina Patel", "Elliot James", "Jo Weber", "Helen Ortiz"].includes(name)) {
    return "support_manager";
  }
  return "support_agent";
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function messageDate(time) {
  return new Date(`2026-05-31T${time}:00.000Z`);
}
