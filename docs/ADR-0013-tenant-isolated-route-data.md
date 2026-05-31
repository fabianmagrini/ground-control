# ADR 0013: Enforce Tenant-Isolated Route Data Reads

## Status

Accepted

## Context

The API has an OIDC-shaped identity boundary with a tenant slug on every authenticated identity. The database schema already stores tenant IDs on primary product tables, but route-data repository reads were still broad database reads in database mode.

Enterprise support data must never be loaded cross-tenant and then filtered only in application presentation logic.

## Decision

Make route-data repository reads tenant-aware.

Repository methods now accept a tenant route-data context or authenticated identity. In database mode, the repository resolves the identity tenant slug to a tenant ID and applies tenant predicates before reading tickets, accounts, users, messages, knowledge sources, approvals, audit events, and evals.

The Hono API passes the authenticated identity into repository reads before applying RBAC and ABAC filters. Prototype server functions keep the default local demo tenant behavior for fixture fallback and local development.

## Consequences

Positive:

- Database-backed route data is scoped by tenant before response shaping.
- API handlers no longer need to load all tenant rows before authorization filters run.
- Tenant slug becomes an explicit part of the server-side data access contract.

Tradeoffs:

- Missing tenant seed data now fails database-mode requests for that tenant.
- Fixture fallback remains single-tenant until server functions move fully behind tenant-aware APIs.
- This is application-level isolation; database row-level security can still be added later.

Follow-up:

- Add database row-level security policies once deployment tenancy is settled.
- Add tests for tenant-scoped reads with multiple seeded tenants.
- Move TanStack server functions behind the auth-aware API or shared tenant-aware service boundary.
