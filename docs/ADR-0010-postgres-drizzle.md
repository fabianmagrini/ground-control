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

Define the initial table model in `src/db/schema.ts` for tenants, users, accounts, tickets, messages, approvals, audit events, traces, prompts, evals, knowledge sources, and chunks.

Use tenant-scoped UUID primary keys for database records and keep fixture-compatible external IDs where the prototype already exposes IDs such as `TCK-4821`, `APR-902`, and `KB-102`. Store trace steps, tool calls, retrieved source IDs, and flexible metadata as JSONB until those shapes need separate queryable tables. Store chunk embeddings in a pgvector `vector(1536)` column to match the planned retrieval direction.

Do not connect current UI workflows to the database yet. Existing fixture-backed server functions remain active until schema, seed data, and migration scripts exist.

Route-data endpoints should read through a repository boundary. Until local seed data exists, the repository keeps a fixture fallback by default and switches to Postgres only when `GROUND_CONTROL_ROUTE_DATA_SOURCE=database` or `GROUND_CONTROL_USE_DATABASE=true` is set.

## Consequences

Positive:

- Establishes the local persistence toolchain without changing runtime behavior.
- Provides a clear place for table definitions and migrations.
- Keeps the future path open for pgvector-backed retrieval.
- Aligns database access with server-only code boundaries.
- Gives the fixture-backed prototype a concrete database target without forcing an immediate data migration.
- Makes the database-backed endpoint path testable without requiring every local UI check to run Postgres.

Tradeoffs:

- Drizzle Kit introduces development dependencies and audit surface.
- Full persistence behavior still depends on local seed data and database command documentation.
- Local developers need a Postgres `DATABASE_URL` when running database commands.
- JSONB trace and metadata fields are flexible but less relationally queryable until usage patterns are clearer.

Follow-up:

- Generate and review migrations.
- Add local seed data.
- Remove the fixture fallback after persistence behavior is verified.
