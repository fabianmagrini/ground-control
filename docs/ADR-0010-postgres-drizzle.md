# ADR 0010: Use Postgres and Drizzle for Persistence

## Status

Accepted

## Context

The prototype has a Hono API boundary, TanStack Start server functions, query-backed route data, and shared Zod contracts. The next production step is persistence for tickets, accounts, approvals, audit events, traces, prompts, evals, knowledge sources, and chunks.

The target stack already identifies Postgres with pgvector and Drizzle ORM as the preferred persistence foundation.

## Decision

Use Postgres as the primary relational database and Drizzle ORM for schema definition, migrations, and typed queries.

Add:

- `drizzle-orm`
- `postgres`
- `drizzle-kit`
- `drizzle.config.ts`
- `src/db/client.ts`
- `src/db/schema.ts`

Keep the schema file as a placeholder until the table model is added in the next backlog item.

Do not connect current UI workflows to the database yet. Existing fixture-backed server functions remain active until schema, seed data, and migration scripts exist.

## Consequences

Positive:

- Establishes the local persistence toolchain without changing runtime behavior.
- Provides a clear place for table definitions and migrations.
- Keeps the future path open for pgvector-backed retrieval.
- Aligns database access with server-only code boundaries.

Tradeoffs:

- Drizzle Kit introduces development dependencies and audit surface.
- No persistence behavior changes until tables and seed data are implemented.
- Local developers need a Postgres `DATABASE_URL` when running database commands.

Follow-up:

- Add table definitions for the Phase 3 data model.
- Generate and review migrations.
- Add local seed data.
- Replace fixture-backed endpoints after persistence behavior is verified.
