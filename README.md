# Ground Control Support Console

Enterprise support-command-center prototype for a modern web app with an intelligence layer.

The current app uses TanStack Start, React, and TypeScript. It includes shared Zod contracts, an optional Postgres/Drizzle route-data repository, an authenticated Hono API boundary, and a deterministic intelligence service. The primary interactive workflow remains a prototype: Copilot execution and workflow-changing actions currently run in browser-local React state, and fixture data remains the default.

## Run Locally

Install dependencies once:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open:

```text
http://localhost:4173/support
```

Build and type-check:

```bash
npm run check
npm run build
```

Run UI smoke tests:

```bash
npm run test:ui
```

Run intelligence regression evals:

```bash
npm run evals
```

Start the optional local Postgres database:

```bash
npm run db:up
npm run db:push
npm run db:seed
GROUND_CONTROL_ROUTE_DATA_SOURCE=database npm run dev
```

## What It Shows

- Support command center with queue filters, SLA state, ARR, customer risk, sentiment, and account context
- Copilot panel that summarizes, retrieves sources, suggests actions, and drafts replies
- Visible intelligence-layer trace for policy checks, context building, retrieval, model routing, validation, and human approval
- Approval, knowledge operations, observability, evaluation, and governance sections
- Simulated knowledge base, tool registry, ingestion pipeline, model gateway, eval suite, and audit trail

See [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) for current prototype screenshots.

## Current Prototype Files

- `src/routes`: TanStack Start route files
- `src/ui/GroundControlApp.tsx`: App shell composition
- `src/ui/AppState.tsx`: Client-local orchestration for prototype workflows
- `src/ui/sections`: Route-level feature sections
- `src/ui/components.tsx`: Shared UI components
- `src/domain`: Typed fixtures, query-backed route data, and server functions
- `src/api`: Hono read API with authentication and authorization policy enforcement
- `src/auth`: OIDC-shaped identity parsing, RBAC, and ABAC
- `src/db`: Drizzle schema and fixture/Postgres route-data repository
- `src/intelligence`: Prompt registry, retrieval, model gateway, structured output, and validators
- `src/observability`: OpenTelemetry spans and local AI observation events
- `packages/contracts`: Shared Zod schemas and inferred types
- `styles.css`: Responsive enterprise-console styling
- `index.html` and `app.js`: Legacy static prototype retained as migration reference
- `AGENTS.md`: Instructions for AI coding agents working in this repo
- `docs/ARCHITECTURE.md`: Reference architecture and target service boundaries
- `docs/README.md`: Documentation index
- `docs/STACK.md`: Recommended TanStack Start + TypeScript stack
- `docs/DEVELOPMENT.md`: Local workflow and conventions
- `docs/BACKLOG.md`: Suggested implementation roadmap
- `docs/ADR-*.md`: Architecture decision records

## Demo Flow

1. Select a ticket from the queue.
2. Click `Run Copilot`.
3. Review the summary, suggested action, retrieved sources, draft reply, and trace.
4. Open `Approvals`, `Knowledge`, `Observability`, and `Governance`.
5. Use `Insert Draft`, `Escalate`, `Approve Reply`, and `Run Evals` to exercise enterprise workflows.

## Target Direction

The production path remains:

```text
TanStack Start + React + TypeScript
Hono/Fastify API service
Postgres + pgvector
Redis
S3-compatible object storage
TypeScript intelligence service
OpenTelemetry + Langfuse
```

The app has routes for `/support`, `/approvals`, `/knowledge`, `/observability`, and `/governance`. The original implementation backlog is complete; [docs/BACKLOG.md](docs/BACKLOG.md) records that delivery and identifies the next productionization horizon. [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md) is the source of truth for release blockers.
