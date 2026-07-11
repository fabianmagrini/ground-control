# Architecture

## Current Runtime Boundaries

The repository contains the intended service boundaries, but they are not all on the primary UI execution path yet.

```text
Browser routes
  |-- TanStack Query -> TanStack Start server functions -> fixture/Postgres repository
  |-- AppState hooks -> client-local workflow transitions
  `-- Copilot hook -> deterministic intelligence service in the web runtime

Hono API
  `-- authenticated, authorized, tenant-scoped read endpoints
      (implemented, but not currently used by the main browser route-data flow)
```

Implemented today:

- URL-backed TanStack Start routes and query-backed initial route data
- Shared Zod contracts across UI, server functions, API, and intelligence results
- Fixture-backed data by default, with optional tenant-scoped Postgres reads
- Hono read endpoints with OIDC-shaped identity, RBAC, ABAC, and tracing
- Deterministic prompt, retrieval, model-routing, validation, trace, and eval behavior
- Client-local approvals, escalation, audit updates, and Copilot workflow state

The main productionization seam is moving reads, Copilot runs, and workflow-changing actions behind authenticated server/API boundaries and persisting their results. The Hono API should not be interpreted as protecting browser workflows that do not yet call it.

## Reference Model

```text
Browser
  |
TanStack Start web app
  |-- routes and layouts
  |-- typed route modules
  |-- server functions for route-data reads
  |-- TanStack Query route-data cache
  |
API service
  |-- auth enforcement
  |-- tickets/accounts/approvals/audit
  |-- tenant and role policy
  |
Intelligence service
  |-- context builder
  |-- retrieval
  |-- tool registry
  |-- model gateway
  |-- validation and guardrails
  |-- trace emission
  |
Data services
  |-- Postgres
  |-- pgvector
  |-- Redis
  |-- object storage
  |-- observability/evals
```

## Architecture Decisions

- [ADR 0001: Use TanStack Start and TypeScript](ADR-0001-tanstack-start-typescript.md)
- [ADR 0002: Use URL-Backed Route Sections](ADR-0002-url-backed-route-sections.md)
- [ADR 0003: Keep Prototype State in a Dedicated AppState Context](ADR-0003-prototype-state-boundary.md)
- [ADR 0004: Use Server Functions as the First Backend Boundary](ADR-0004-server-function-boundary.md)
- [ADR 0005: Temporarily Retain the Legacy Static Prototype](ADR-0005-retain-legacy-static-prototype.md)
- [ADR 0006: Use Playwright for UI Smoke Tests](ADR-0006-playwright-ui-smoke-tests.md)
- [ADR 0007: Use TanStack Query for Route Data](ADR-0007-query-backed-route-data.md)
- [ADR 0008: Use Shared Zod Contracts](ADR-0008-shared-zod-contracts.md)
- [ADR 0009: Add Hono API Service Boundary](ADR-0009-hono-api-service.md)
- [ADR 0010: Use Postgres and Drizzle for Persistence](ADR-0010-postgres-drizzle.md)
- [ADR 0011: Add an Intelligence Service Boundary](ADR-0011-intelligence-service-boundary.md)
- [ADR 0012: Add OIDC-Shaped API Auth With RBAC and ABAC](ADR-0012-oidc-rbac-abac.md)
- [ADR 0013: Enforce Tenant-Isolated Route Data Reads](ADR-0013-tenant-isolated-route-data.md)
- [ADR 0014: Add OpenTelemetry Trace Instrumentation](ADR-0014-opentelemetry-traces.md)
- [ADR 0015: Add Vendor-Neutral AI Observability Events](ADR-0015-ai-observability-events.md)
- [ADR 0016: Add Intelligence Eval Regression Gates](ADR-0016-eval-regression-gates.md)
- [ADR 0017: Add CI Verification Pipeline](ADR-0017-ci-verification-pipeline.md)
- [ADR 0018: Add Production Security Review Gate](ADR-0018-production-security-review.md)
- [ADR 0019: Use Native Dashboard Components for Observability](ADR-0019-dashboard-visualization-libraries.md)

## Core Principle

The application owns truth and action. The intelligence layer recommends, drafts, retrieves, reasons, and validates through controlled interfaces.

Avoid:

```text
LLM -> direct database access -> direct customer action
```

Prefer:

```text
LLM -> orchestrator -> approved tool -> app service -> permission check -> audit event
```

## Target Service Boundaries

### Web App

- TanStack Start routes
- Enterprise UI shell
- Route modules and route-data server functions
- Client-local prototype state in `src/ui/AppState.tsx`
- Streaming UI for Copilot runs
- Human-in-the-loop approval surfaces

### API Service

- Authentication and authorization enforcement
- Ticket, account, approval, audit, and workflow APIs
- Tenant isolation
- External integration boundaries

### Intelligence Service

- Prompt and policy registry
- Context builder
- RAG retrieval and reranking
- Tool registry
- Model gateway and fallback routing
- Structured output validation
- Trace and eval hooks

### Ingestion Worker

- Source upload handling
- Parsing and normalization
- Chunking
- Embedding generation
- Metadata and access-policy assignment
- Golden-question retrieval checks

## Main Copilot Flow

1. Web app sends `ticketId`, user identity, and requested mode.
2. API validates access to ticket and account.
3. Intelligence service builds context from ticket, account, policy, and knowledge sources.
4. Retrieval runs with tenant, role, account, region, and freshness filters.
5. Model gateway selects model and fallback policy.
6. Tool calls are allowed only through registered schemas.
7. Output validator checks citations, sensitive data, unsupported promises, and approval requirements.
8. App stores trace, audit event, retrieved sources, and user-facing draft.
9. Human reviewer approves, edits, escalates, or rejects.

## Observability Requirements

Every AI run should store:

- User and tenant context
- Prompt version
- Model and provider
- Retrieved source IDs
- Tool calls and results
- Output validation status
- Latency and cost
- Human approval decision
- Feedback and eval linkage
