# ADR 0005: Temporarily Retain the Legacy Static Prototype

## Status

Accepted

## Context

The project began as a static prototype using `index.html`, `styles.css`, and `app.js`. The main implementation has now moved to TanStack Start and TypeScript, but the static files still provide a useful behavior reference while the migration continues.

## Decision

Keep `index.html` and `app.js` temporarily as legacy reference files.

Do not extend them with new product behavior.

The source of truth for future development is:

- `src/routes`
- `src/ui`
- `src/domain`
- `styles.css`

## Consequences

Positive:

- Future agents can compare migrated behavior against the original prototype.
- Reduces risk while server-function and persistence migration continues.
- Makes rollback/debugging easier during the early refactor phase.

Tradeoffs:

- Duplicate behavior exists temporarily.
- Agents may accidentally edit the legacy files if instructions are unclear.

Follow-up:

- Remove `index.html` and `app.js` once all major workflows are covered by TypeScript routes and tests.
- Until removal, documentation should clearly label them as legacy reference files.
