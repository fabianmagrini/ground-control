# ADR 0017: Add CI Verification Pipeline

## Status

Accepted

## Context

The project now has TypeScript checks, UI smoke tests, deterministic intelligence evals, a production build, and a growing enterprise-readiness surface. These gates should run consistently before changes land on `main`.

The repository does not yet have approved hosting, deployment credentials, environment promotion rules, or production secrets.

## Decision

Add `.github/workflows/ci.yml` as the initial deployment pipeline foundation.

The workflow runs on pull requests and pushes to `main`:

- `npm ci`
- Playwright Chromium install
- `npm run check`
- `npm run check:legacy`
- `npm run evals`
- `npm run build`
- `npm run test:ui`
- upload `dist/` as a build artifact

Do not deploy to a runtime environment yet. Treat this as the verification and artifact stage of the deployment pipeline until hosting and secret management are approved.

## Consequences

Positive:

- Main branch changes now have repeatable automated gates.
- Intelligence regression evals run alongside UI and build checks.
- Build artifacts are retained without requiring production credentials.

Tradeoffs:

- No production or preview environment is created yet.
- Playwright browser installation increases CI runtime.
- Database-backed mode is not exercised until CI has a database service and seeded data.

Follow-up:

- Add preview deployment once hosting is selected.
- Add database service checks for migration and seed flows.
- Add protected branch requirements for the CI workflow.
