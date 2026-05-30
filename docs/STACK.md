# Stack Recommendation

## Preferred Stack

```text
TanStack Start + React + TypeScript
TanStack Router
TanStack Query
TanStack Table
TanStack Form
Hono or Fastify
Drizzle ORM
Postgres + pgvector
Redis
S3-compatible object storage
Zod
OpenTelemetry
Langfuse
```

## Why TanStack Start

TanStack Start fits this product because the app is route-heavy, workflow-heavy, data-heavy, and table-heavy. It gives the project a full-stack React structure without choosing Next.js.

Use it for:

- Application shell
- Route-level data loading
- Server functions for app-adjacent operations
- SSR and streaming where useful
- Type-safe navigation and params

## TypeScript Usage

Use TypeScript for:

- UI components
- Route definitions
- Server functions
- API contracts
- Tool schemas
- Structured model outputs
- Authorization inputs
- Eval result schemas
- Workflow state transitions

Python can still be introduced later for specialized ingestion, offline eval generation, or data-science workflows, but the main product should be TypeScript-first.

## Proposed Monorepo Shape

```text
apps/
  web/
    TanStack Start app
  api/
    Hono or Fastify service
  intelligence/
    model gateway, retrieval, tools, validation
  worker/
    ingestion and async jobs

packages/
  contracts/
    Zod schemas and shared types
  db/
    Drizzle schema and migrations
  ui/
    shared components
  evals/
    datasets and scoring utilities
```

## First Real Backend Milestone

Start with a TypeScript-only backend:

- Hono or Fastify
- Drizzle
- Postgres
- Zod request/response validation
- In-memory model gateway stub
- Stored traces and audit events

Then add real model calls and retrieval once the API contracts are stable.
