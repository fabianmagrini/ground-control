# ADR 0004: Use Server Functions as the First Backend Boundary

## Status

Accepted

## Context

The project needs to move beyond mocks, but jumping directly to a separate API service, Postgres, retrieval service, and model gateway would create too much surface area at once. TanStack Start server functions provide a typed backend boundary inside the app while preserving a path to separate services later.

## Decision

Use TanStack Start server functions for the first backend boundary when moving prototype actions out of client-local state.

Initial candidates:

- `getTickets`
- `getTicket`
- `runCopilot`
- `approveReply`
- `requestEscalation`
- `searchKnowledge`
- `runEvals`

Server functions should call domain/service modules rather than embedding business logic directly in route files.

## Consequences

Positive:

- Enables incremental migration away from local component state.
- Keeps request/response contracts close to the UI during early development.
- Avoids premature service sprawl.
- Preserves a future path to Hono/Fastify or dedicated intelligence services.

Tradeoffs:

- No server functions own product workflow state yet.
- Server functions are not a substitute for long-term service boundaries.
- Heavy model orchestration, ingestion, and eval jobs should eventually move out of the web runtime.
- Authorization and audit logic must be added before real customer data is introduced.

Rule:

Do not call model providers or access secrets from browser code. Server functions or backend services must own those boundaries.
