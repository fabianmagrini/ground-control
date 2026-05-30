# Backlog

## Phase 0: Prototype Hardening

- [x] Add explicit test IDs to critical interactive controls where accessible names are not enough.
- [x] Split `src/ui/AppState.tsx` into domain-specific hooks once server-function boundaries are clearer.
- Add lightweight UI smoke tests once a test runner exists.
- Add screenshots to documentation.

## Phase 1: TanStack Start Migration

- Add `/support/$ticketId` for deep-linked ticket selection.
- Move all remaining fixture state transitions into typed hooks or server functions.
- Add TanStack Query for route data.
- Add TanStack Table for queues and logs.

## Phase 2: Shared Contracts

- Create `packages/contracts`.
- Add Zod schemas for:
  - Ticket
  - Account
  - KnowledgeSource
  - Approval
  - AuditEvent
  - CopilotRunRequest
  - CopilotRunResult
  - AiTrace
  - ToolCall
  - EvalRun
- Use schemas in server functions and UI.

## Phase 3: API and Persistence

- Add Hono or Fastify API service.
- Add Postgres and Drizzle.
- Add tables for tenants, users, accounts, tickets, messages, approvals, audit events, traces, prompts, evals, knowledge sources, and chunks.
- Replace fixtures with database-backed endpoints.
- Add local seed data.

## Phase 4: Real Intelligence Layer

- Create an intelligence service.
- Add model-gateway abstraction.
- Add prompt registry and prompt versioning.
- Add structured outputs.
- Add retrieval over Postgres full-text and pgvector.
- Add permission-aware retrieval filters.
- Add source citations and output validators.

## Phase 5: Enterprise Readiness

- Add SSO/OIDC with RBAC and ABAC.
- Add tenant isolation.
- Add OpenTelemetry traces.
- Add Langfuse or equivalent AI observability.
- Add eval runner and regression gates.
- Add deployment pipeline.
- Add production security review.
