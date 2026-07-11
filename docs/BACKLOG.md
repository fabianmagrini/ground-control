# Backlog

Status: the original prototype-to-enterprise-readiness implementation backlog is complete. Checked items below describe delivered prototype capabilities, not a declaration that the application is production-ready. See [Production Security Review](SECURITY_REVIEW.md) for current release blockers.

## Phase 0: Prototype Hardening

- [x] Add explicit test IDs to critical interactive controls where accessible names are not enough.
- [x] Split `src/ui/AppState.tsx` into domain-specific hooks once server-function boundaries are clearer.
- [x] Add lightweight UI smoke tests once a test runner exists.
- [x] Add screenshots to documentation.

## Phase 1: TanStack Start Migration

- [x] Add `/support/$ticketId` for deep-linked ticket selection.
- [x] Move all remaining fixture state transitions into typed hooks or server functions.
- [x] Add TanStack Query for route data.
- [x] Add TanStack Table for queues and logs.

## Phase 2: Shared Contracts

- [x] Create `packages/contracts`.
- [x] Add Zod schemas for:
  - [x] Ticket
  - [x] Account
  - [x] KnowledgeSource
  - [x] Approval
  - [x] AuditEvent
  - [x] CopilotRunRequest
  - [x] CopilotRunResult
  - [x] AiTrace
  - [x] ToolCall
  - [x] EvalRun
- [x] Use schemas in server functions and UI.

## Phase 3: API and Persistence

- [x] Add Hono or Fastify API service.
- [x] Add Postgres and Drizzle.
- [x] Add tables for tenants, users, accounts, tickets, messages, approvals, audit events, traces, prompts, evals, knowledge sources, and chunks.
- [x] Replace fixtures with database-backed endpoints.
- [x] Add local seed data.

## Phase 4: Real Intelligence Layer

- [x] Create an intelligence service.
- [x] Add model-gateway abstraction.
- [x] Add prompt registry and prompt versioning.
- [x] Add structured outputs.
- [x] Add retrieval over Postgres full-text and pgvector.
- [x] Add permission-aware retrieval filters.
- [x] Add source citations and output validators.

## Phase 5: Enterprise Readiness

- [x] Add SSO/OIDC with RBAC and ABAC.
- [x] Add tenant isolation.
- [x] Add OpenTelemetry traces.
- [x] Add Langfuse or equivalent AI observability.
- [x] Add eval runner and regression gates.
- [x] Add deployment pipeline.
- [x] Add production security review.

## Next Horizon: Productionization

- [ ] Route browser data access through authenticated, authorization-aware service boundaries.
- [ ] Move Copilot runs, approvals, escalation, and customer-visible actions to server-owned workflows.
- [ ] Persist workflow mutations, traces, and immutable audit events.
- [ ] Replace trusted local claims with verified OIDC bearer tokens.
- [ ] Add database row-level security or equivalent database-enforced tenant isolation.
- [ ] Add authorization, tenant-isolation, approval-gate, and unsafe-output security tests.
- [ ] Configure production secrets, telemetry export, redaction, and retention policies.
- [ ] Define deployment environments, promotion and rollback policy, backups, and incident response.
