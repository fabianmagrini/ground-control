# Documentation Index

Start here when reviewing or extending the project documentation.

## Current-State Docs

- [Development Guide](DEVELOPMENT.md): local workflow, verification, and code organization
- [Architecture](ARCHITECTURE.md): current/target architecture model and service boundaries
- [Backlog](BACKLOG.md): phased roadmap from prototype to production app
- [Screenshots](SCREENSHOTS.md): visual reference for current prototype sections

## Stack And Decisions

- [Stack Recommendation](STACK.md): preferred TanStack Start + TypeScript stack
- [ADR 0001](ADR-0001-tanstack-start-typescript.md): TanStack Start and TypeScript
- [ADR 0002](ADR-0002-url-backed-route-sections.md): URL-backed route sections
- [ADR 0003](ADR-0003-prototype-state-boundary.md): prototype state boundary
- [ADR 0004](ADR-0004-server-function-boundary.md): server-function backend boundary
- [ADR 0005](ADR-0005-retain-legacy-static-prototype.md): legacy static prototype retention
- [ADR 0006](ADR-0006-playwright-ui-smoke-tests.md): Playwright UI smoke tests
- [ADR 0007](ADR-0007-query-backed-route-data.md): TanStack Query-backed route data
- [ADR 0008](ADR-0008-shared-zod-contracts.md): shared Zod contracts
- [ADR 0009](ADR-0009-hono-api-service.md): Hono API service boundary
- [ADR 0010](ADR-0010-postgres-drizzle.md): Postgres and Drizzle persistence
- [ADR 0011](ADR-0011-intelligence-service-boundary.md): intelligence service boundary
- [ADR 0012](ADR-0012-oidc-rbac-abac.md): OIDC-shaped API auth with RBAC and ABAC
- [ADR 0013](ADR-0013-tenant-isolated-route-data.md): tenant-isolated route data reads
- [ADR 0014](ADR-0014-opentelemetry-traces.md): OpenTelemetry trace instrumentation
- [ADR 0015](ADR-0015-ai-observability-events.md): vendor-neutral AI observability events
- [ADR 0016](ADR-0016-eval-regression-gates.md): intelligence eval regression gates

## Documentation Rules

- Keep current implementation facts separate from target architecture.
- Update ADRs when an accepted decision changes materially.
- Prefer adding a new ADR over rewriting decision history.
- Keep `README.md` concise and put deeper details in `docs/`.
