# Documentation Index

Start here when reviewing or extending the project documentation.

## Current-State Docs

- [Development Guide](DEVELOPMENT.md): local workflow, verification, and code organization
- [Architecture](ARCHITECTURE.md): current/target architecture model and service boundaries
- [Backlog](BACKLOG.md): phased roadmap from prototype to production app

## Stack And Decisions

- [Stack Recommendation](STACK.md): preferred TanStack Start + TypeScript stack
- [ADR 0001](ADR-0001-tanstack-start-typescript.md): TanStack Start and TypeScript
- [ADR 0002](ADR-0002-url-backed-route-sections.md): URL-backed route sections
- [ADR 0003](ADR-0003-prototype-state-boundary.md): prototype state boundary
- [ADR 0004](ADR-0004-server-function-boundary.md): server-function backend boundary
- [ADR 0005](ADR-0005-retain-legacy-static-prototype.md): legacy static prototype retention

## Documentation Rules

- Keep current implementation facts separate from target architecture.
- Update ADRs when an accepted decision changes materially.
- Prefer adding a new ADR over rewriting decision history.
- Keep `README.md` concise and put deeper details in `docs/`.
