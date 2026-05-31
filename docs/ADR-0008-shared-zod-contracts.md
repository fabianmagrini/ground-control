# ADR 0008: Use Shared Zod Contracts

## Status

Accepted

## Context

The prototype is moving from local fixtures toward server functions, query-backed route data, and eventually API services. The same entities appear across UI state, route data, future server boundaries, audit records, evals, and AI orchestration outputs.

TypeScript-only types are useful during development, but they do not validate runtime data crossing those boundaries.

## Decision

Create `packages/contracts` as the shared contract package.

Use Zod schemas for core product and intelligence-layer contracts:

- Tickets and account context
- Knowledge sources
- Approvals
- Audit events
- Copilot run request and result
- AI traces
- Tool calls
- Eval runs

Export inferred TypeScript types from the schemas and keep `src/domain/types.ts` as a compatibility re-export for the current app.

## Consequences

Positive:

- Provides a runtime validation layer for future server functions and API services.
- Keeps UI, route data, fixtures, and AI workflow contracts aligned.
- Makes schema drift easier to detect as persistence and external integrations are introduced.
- Preserves existing app import paths while introducing the shared package.

Tradeoffs:

- Current usage is mostly type-level; runtime parsing still needs to be wired into server functions and route data.
- Schema changes now need to account for both TypeScript inference and runtime validation semantics.

Follow-up:

- Use schemas in server functions and query data boundaries.
- Add contract-level tests once server functions or package-level test tooling exists.
- Move package exports to a workspace-aware package boundary if the repo becomes a monorepo.
