# IntelligenceOps Support Console

Enterprise support-console prototype for a modern web app with an intelligence layer.

The current app has been migrated to TanStack Start, React, and TypeScript. It still uses simulated app data, retrieval, model-gateway behavior, trace events, approvals, evals, and governance controls, but the main implementation now lives in typed modules under `src/`.

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
- `src/ui/IntelligenceOpsApp.tsx`: App shell composition
- `src/ui/AppState.tsx`: Shared prototype state and workflow actions
- `src/ui/sections`: Route-level feature sections
- `src/ui/components.tsx`: Shared UI components
- `src/domain`: Typed fixtures and domain types
- `src/intelligence`: Prompt registry, retrieval, model gateway, structured output, and validators
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

The app now has real routes for `/support`, `/approvals`, `/knowledge`, `/observability`, and `/governance`. See [docs/STACK.md](docs/STACK.md) and [docs/BACKLOG.md](docs/BACKLOG.md) for the remaining migration plan.
