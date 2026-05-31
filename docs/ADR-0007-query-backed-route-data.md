# ADR 0007: Use TanStack Query for Route Data

## Status

Accepted

## Context

The prototype still uses in-memory fixtures, but route-level data needs a migration path toward server functions and eventually API-backed endpoints. Components should not import fixture data directly when that data represents route-owned tickets, knowledge sources, approvals, audit events, or evals.

## Decision

Use TanStack Query as the route-data cache boundary.

Initial query options live in `src/domain/routeData.ts` and seed data from fixtures:

- `ticketsRouteDataQueryOptions`
- `knowledgeRouteDataQueryOptions`
- `reviewWorkflowRouteDataQueryOptions`

`AppState` and domain-specific hooks may keep local mutable prototype state, but that state should be initialized from query-backed route data instead of importing fixtures directly.

## Consequences

Positive:

- Creates a stable handoff point for replacing fixtures with server functions.
- Keeps local workflow mutations intact while route data moves toward cache-backed loading.
- Gives route and UI hooks shared query keys and typed query options.

Tradeoffs:

- Query data is currently fixture-backed and synchronous.
- Prototype workflow mutations are still local and do not write through the query cache.

Follow-up:

- Replace query functions with TanStack Start server functions once contracts stabilize.
- Move workflow-changing operations behind server functions before persistence.
