# ADR 0009: Add Hono API Service Boundary

## Status

Accepted

## Context

The app now has TanStack Start routes, query-backed route data, server functions, and shared Zod contracts. The next persistence step needs a clear API-service boundary before introducing Postgres, Drizzle, auth enforcement, or real integrations.

The service should be small enough for the prototype, but compatible with the target architecture.

## Decision

Use Hono for the initial API service boundary.

Add a fixture-backed `src/api` module with validated endpoints for:

- health
- tickets
- ticket by ID
- knowledge sources
- review workflow data

Use shared Zod contracts to validate API responses before returning JSON.

Do not wire the UI to this API yet. TanStack Start server functions remain the current web boundary until persistence and auth contracts are stable.

## Consequences

Positive:

- Creates the API-service shape without forcing database or deployment decisions.
- Keeps response data aligned with shared runtime contracts.
- Provides a future target for replacing fixture-backed server functions.
- Leaves current UI behavior unchanged.

Tradeoffs:

- The API is not yet mounted in a running server entry.
- Endpoints are fixture-backed and do not enforce auth, tenancy, or persistence.
- Workflow-changing operations still need POST endpoints once persistence is introduced.

Follow-up:

- Add Postgres and Drizzle schema after contracts stabilize.
- Add auth and tenant enforcement before exposing customer data.
- Move route-data server functions to call the API service or shared service modules once persistence exists.
