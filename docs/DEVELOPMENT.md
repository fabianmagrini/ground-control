# Development Guide

## Current TanStack Start App

Run:

```bash
npm install
npm run dev
```

Type-check and build:

```bash
npm run check
npm run build
```

Run UI smoke tests:

```bash
npm run test:ui
```

The current app uses TanStack Start, React, TypeScript, and Vite.

## Database-Backed Route Data

Route data is read through `src/db/routeDataRepository.ts`. By default, the repository keeps the fixture fallback active so local UI smoke tests do not require Postgres before seed data exists.

Start local Postgres with Docker:

```bash
npm run db:up
```

This starts `ground-control-postgres` from the `pgvector/pgvector:pg16` image and exposes:

```text
postgres://postgres:postgres@localhost:5432/intelligence_ops
```

Apply the Drizzle schema and load the demo tenant:

```bash
npm run db:push
npm run db:seed
```

To read route data from Postgres-backed endpoints, run:

```bash
GROUND_CONTROL_ROUTE_DATA_SOURCE=database npm run dev
```

Useful database commands:

```bash
npm run db:logs
npm run db:down
```

The seed script resets only the `ground-control-demo` tenant and reloads the prototype tickets, messages, knowledge sources, approvals, audit events, prompt, trace, evals, and chunks.

## Local Verification

After UI changes:

1. Open `http://localhost:4173`.
2. Verify support queue renders.
3. Click `Run Copilot`.
4. Confirm sources, trace, draft, and audit update.
5. Visit Approvals, Knowledge, Observability, and Governance.
6. Check browser console for errors.

## Local API Auth

The Hono API enforces an OIDC-shaped identity, RBAC permissions, and ABAC filters. In local development, requests without identity headers use the built-in `local-dev` admin identity. To test a specific identity, send trusted claims in `x-ground-control-oidc-claims`:

```json
{
  "sub": "user-123",
  "email": "agent@example.com",
  "name": "Support Agent",
  "tenant": "ground-control-demo",
  "roles": ["support_agent"],
  "regions": ["APAC", "US"],
  "entitlements": ["All support", "Enterprise support"]
}
```

Production must verify OIDC tokens before claims are trusted by the API.

## Code Organization Guidance

Current app structure:

- `src/domain/types.ts`: domain types
- `src/domain/fixtures.ts`: mock data
- `src/auth`: OIDC-shaped identity parsing, RBAC, ABAC, and API auth middleware
- `src/intelligence`: intelligence service, retrieval, prompt registry, model gateway, and validators
- `src/ui/IntelligenceOpsApp.tsx`: app shell composition
- `src/ui/AppState.tsx`: prototype state and workflow actions
- `src/ui/sections`: route-level feature components
- `src/ui/components.tsx`: shared UI building blocks
- `src/routes`: TanStack Start route definitions

Next cleanup steps:

- Move state transitions into typed hooks.
- Move server-owned operations into TanStack Start server functions.
- Move domain types to `packages/contracts` when a monorepo is introduced.

## Naming Conventions

- Domain entities: `Ticket`, `Account`, `KnowledgeSource`, `Approval`, `AuditEvent`, `AiTrace`, `ToolCall`, `EvalRun`
- Functions that change state should use verbs: `runCopilot`, `approveReply`, `requestEscalation`
- Functions that render state should use `render*` only in the static prototype

## Security Notes

- Do not commit secrets.
- Do not add real provider keys to source files.
- Do not make model calls from the browser.
- Do not bypass authorization in tool handlers.
- Do not let retrieved customer content override system or policy instructions.
