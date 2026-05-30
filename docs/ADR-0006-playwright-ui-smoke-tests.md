# ADR 0006: Use Playwright for UI Smoke Tests

## Status

Accepted

## Context

The prototype now has stable `data-testid` hooks on critical controls and enough UI behavior to regress accidentally during migration. Existing checks cover TypeScript compilation, production build, and legacy static syntax, but they do not exercise the support workflow in a browser.

The app needs a lightweight test layer that verifies the current TanStack Start UI can render, navigate, run Copilot, update workflow state, and keep operational sections interactive.

## Decision

Use Playwright for UI smoke tests.

Add `@playwright/test`, `playwright.config.ts`, and `npm run test:ui`.

Run smoke tests against the local Vite dev server at `http://localhost:4173`. Reuse the existing server outside CI when available.

Keep the initial tests focused on critical prototype paths:

- Support route renders.
- `Run Copilot` produces summary, sources, draft, trace, and approval metadata.
- `Insert Draft` and `Approve Reply` update visible workflow state.
- Ticket selection resets Copilot output.
- Knowledge search filters sources.
- Observability evals can run and update visible scores.

## Consequences

Positive:

- Catches broken route rendering and workflow regressions before deeper backend migration.
- Gives future agents a stable, automated way to verify frontend changes.
- Turns the explicit `data-testid` hooks into useful testing contracts.
- Documents the minimum user journeys that should keep working while internals move to hooks, server functions, and query-backed data.

Tradeoffs:

- Requires Playwright browser binaries in local and CI environments.
- Smoke tests are intentionally narrow and do not replace unit, contract, accessibility, or full end-to-end coverage.
- Tests currently rely on mock data and client-local prototype behavior.

Follow-up:

- Add CI execution once the deployment pipeline exists.
- Expand smoke coverage when `/support/$ticketId`, server functions, and TanStack Query are introduced.
- Keep selectors stable for product-critical workflows, but avoid overfitting tests to incidental layout or copy.
