# AI Coding Agent Guide

This repository is a prototype for an enterprise support app with an intelligence layer. Treat it as a product seed, not a throwaway demo.

## Current State

- The main app is TanStack Start + React + TypeScript.
- `src/domain` contains typed mock domain data, simulated retrieval, model routing, guardrails, evals, approvals, and audit events.
- `src/ui/IntelligenceOpsApp.tsx` contains the app shell composition.
- `src/ui/AppState.tsx` exposes the shared prototype state context and composes domain-specific hooks.
- `src/ui/hooks` contains prototype state hooks for tickets, Copilot runs, review workflows, and knowledge search.
- `src/ui/sections` contains route-level feature components.
- `index.html` and `app.js` are legacy static prototype files retained as migration reference.
- There is no real backend, database, authentication, or model provider yet.

## Product Intent

Build toward an enterprise-grade support console where the intelligence layer is explicit and inspectable:

- App owns truth and actions.
- Intelligence layer owns context assembly, retrieval, model/tool orchestration, validation, and traces.
- Human approval gates are required for customer-visible or workflow-changing actions.
- Retrieval must be permission-aware.
- Every AI run should produce trace, source, tool, audit, and eval metadata.

## Preferred Target Stack

- TanStack Start + React + TypeScript
- TanStack Router, Query, Table, and Form
- Hono or Fastify for API services
- Drizzle ORM with Postgres and pgvector
- Redis for cache, queues, and rate limiting
- S3-compatible object storage for uploaded knowledge sources
- Zod for shared runtime validation
- OpenTelemetry and Langfuse for traces

## Working Rules

- Keep changes scoped and product-oriented.
- Treat the TanStack Start routes under `src/` as the source of truth.
- Do not extend the legacy static prototype unless explicitly asked.
- Use TypeScript for new application code where practical.
- Prefer shared schemas and contracts over duplicated loose objects.
- Keep browser code free of provider secrets, privileged tool execution, and real customer-data access.
- Move workflow-changing operations toward server functions before adding persistence or real integrations.
- Do not wire real model providers, secrets, SSO, or cloud services without explicit user approval.
- Do not remove existing demo behavior unless the replacement is verified.
- After frontend changes, run the app and verify in the browser.

## Testing and Visual References

- Use `npm run test:ui` for UI smoke coverage after changes to routes, shared state, workflows, navigation, or critical controls.
- Keep `data-testid` values stable for product-critical workflows covered by smoke tests.
- Update `docs/SCREENSHOTS.md` and `docs/screenshots/` when a visible workflow changes materially.

## Architecture Decisions

- When a change introduces or materially changes an architectural choice, add or update an ADR in `docs/`.
- Prefer adding a new ADR for new accepted decisions; update an existing ADR only when the implementation evolves within the same decision.
- Keep ADRs concise: context, decision, consequences, and follow-up.
- Link new ADRs from `docs/README.md` and `docs/ARCHITECTURE.md`.
- Do not create ADRs for routine implementation details, small UI tweaks, or backlog progress unless they establish a repeatable project convention.

## Suggested Migration Sequence

1. Add Zod schemas for tickets, accounts, knowledge sources, traces, tools, approvals, and evals.
2. Move route data and actions from `AppState.tsx` into server functions backed by in-memory fixtures.
3. Add Postgres + Drizzle once the contracts stabilize.
4. Add real retrieval and model-gateway services.
5. Replace prototype-local state with TanStack Query backed data.

## Verification Checklist

- `npm run check` passes.
- `npm run build` passes.
- `npm run test:ui` passes for workflow or route changes.
- Main support route renders.
- `Run Copilot` returns summary, sources, draft, trace, and audit.
- Approval and escalation flows update visible state.
- Knowledge, observability, and governance sections render.
- Browser console has no errors.
- No visible `undefined`, broken layout, or overlapping text.
