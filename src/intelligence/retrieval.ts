import type { KnowledgeSource, RetrievedSource, Ticket, TraceStep } from "../domain/types";

export type RetrievalContext = {
  actorRole: "Support Lead" | "Support Agent" | "Billing Ops" | "Engineering" | "Trust";
  accountRegion: string;
  plan: Ticket["plan"];
  ticketKeywords: string[];
};

export type RetrievalResult = {
  sources: RetrievedSource[];
  trace: TraceStep[];
};

export function buildRetrievalContext(ticket: Ticket): RetrievalContext {
  return {
    actorRole: "Support Lead",
    accountRegion: ticket.region,
    plan: ticket.plan,
    ticketKeywords: ticket.keywords,
  };
}

export function retrieveSourcesForTicket({
  ticket,
  knowledgeSources,
}: {
  ticket: Ticket;
  knowledgeSources: KnowledgeSource[];
}): RetrievalResult {
  const context = buildRetrievalContext(ticket);
  const permittedSources = knowledgeSources.filter((source) =>
    canRetrieveSource({ source, context }),
  );

  const sources = permittedSources
    .map((source) => ({
      ...source,
      score: scoreKnowledge(ticket, `${source.id} ${source.title} ${source.topic} ${source.body}`),
    }))
    .filter((source) => source.score > 0 || source.id === "KB-520")
    .sort((first, second) => second.score - first.score)
    .slice(0, 3);

  if (!sources.some((source) => source.id === "KB-520")) {
    const governanceSource = permittedSources.find((source) => source.id === "KB-520");
    if (governanceSource) {
      sources.push({ ...governanceSource, score: 1 });
    }
  }

  return {
    sources,
    trace: [
      {
        title: "Context builder",
        body: `Loaded ${ticket.messages.length} messages, ${ticket.plan} plan, ${ticket.account.contract}, ${ticket.account.dataResidency} residency, and ${ticket.keywords.length} ticket keywords.`,
      },
      {
        title: "Permission-aware retrieval",
        body: `Filtered ${knowledgeSources.length} sources to ${permittedSources.length} allowed sources for ${context.actorRole}, ${context.plan}, and ${context.accountRegion}.`,
      },
      {
        title: "Hybrid retrieval",
        body: `Ran deterministic full-text scoring with pgvector-ready chunk metadata; returned ${sources.map((source) => source.id).join(", ") || "no sources"}.`,
      },
    ],
  };
}

export function createPostgresRetrievalSql({
  query,
  tenantId,
  accessPolicies,
  embedding,
  limit = 5,
}: {
  query: string;
  tenantId: string;
  accessPolicies: string[];
  embedding?: number[];
  limit?: number;
}) {
  return {
    text: `
      select
        ks.external_id,
        ks.title,
        ks.topic,
        ks.freshness,
        ks.access_policy,
        ks.owner_name,
        c.content,
        ts_rank_cd(to_tsvector('english', c.content), plainto_tsquery('english', $1)) as text_rank,
        case when $4::vector is null then null else c.embedding <=> $4::vector end as vector_distance
      from chunks c
      join knowledge_sources ks on ks.id = c.knowledge_source_id
      where c.tenant_id = $2
        and ks.access_policy = any($3)
        and (
          to_tsvector('english', c.content) @@ plainto_tsquery('english', $1)
          or $4::vector is not null
        )
      order by
        text_rank desc,
        vector_distance asc nulls last
      limit $5
    `,
    values: [query, tenantId, accessPolicies, embedding ?? null, limit],
  };
}

function scoreKnowledge(ticket: Ticket, body: string) {
  const haystack = body.toLowerCase();
  return ticket.keywords.reduce(
    (score, keyword) => score + (haystack.includes(keyword.toLowerCase()) ? 1 : 0),
    0,
  );
}

function canRetrieveSource({
  source,
  context,
}: {
  source: KnowledgeSource;
  context: RetrievalContext;
}) {
  if (source.access === "All support") return true;
  if (source.access === "Enterprise support") return context.plan === "Enterprise";
  if (source.access === "Billing operations") {
    return context.ticketKeywords.some((keyword) =>
      ["billing", "invoice", "refund", "chargeback", "renewal"].includes(keyword),
    );
  }
  if (source.access === "Platform support") {
    return context.ticketKeywords.some((keyword) =>
      ["api", "rate", "limit", "migration", "throttling"].includes(keyword),
    );
  }
  return context.actorRole === "Support Lead";
}
