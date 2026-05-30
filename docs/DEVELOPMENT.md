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

## Local Verification

After UI changes:

1. Open `http://localhost:4173`.
2. Verify support queue renders.
3. Click `Run Copilot`.
4. Confirm sources, trace, draft, and audit update.
5. Visit Approvals, Knowledge, Observability, and Governance.
6. Check browser console for errors.

## Code Organization Guidance

Current app structure:

- `src/domain/types.ts`: domain types
- `src/domain/fixtures.ts`: mock data
- `src/domain/copilot.ts`: Copilot simulation
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
