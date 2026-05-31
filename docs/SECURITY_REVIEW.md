# Production Security Review

Date: 2026-05-31

Scope: Ground Control prototype application, API boundary, local database setup, intelligence service, observability, eval gates, and CI verification pipeline.

## Summary

Status: Not production-ready.

The repository now has clear security controls for contracts, local API auth, RBAC/ABAC, tenant-scoped database reads, human approval gates, AI output validation, CI verification, and eval regression gates. It is still a prototype and must not be deployed with real customer data until the release blockers below are closed.

## Current Controls

- TypeScript and Zod contracts validate core route data, Copilot runs, traces, tools, approvals, evals, and auth identity shapes.
- Hono API routes enforce an OIDC-shaped identity boundary, RBAC permissions, and ABAC filters.
- Database-mode route data is scoped by tenant before response shaping.
- Browser code does not call real model providers or hold provider secrets.
- Customer-visible AI drafts require human approval paths.
- Retrieval is permission-aware at the intelligence layer.
- Output validators check citations, sensitive-data patterns, unsupported commitments, and approval requirements.
- OpenTelemetry spans instrument API and intelligence boundaries.
- AI observability events capture prompt/model/retrieval/validation metadata without transmitting to a hosted vendor.
- CI runs typecheck, legacy syntax check, intelligence evals, build, and UI smoke tests.

## Dependency Review

Command run:

```bash
npm audit --omit=dev --audit-level=high
```

Result: 0 production dependency vulnerabilities at high severity or above.

Known note: npm has previously reported moderate advisories in the full dependency tree including development dependencies. Do not run `npm audit fix --force` without a separate compatibility review.

## Release Blockers

- Real OIDC token verification is not implemented. Production must verify issuer, audience, signature, expiration, and key rotation before trusting claims.
- Server functions still use prototype-local state and fixture fallback paths. Production route data should go through auth-aware API or shared auth-aware service boundaries.
- Database row-level security is not implemented. Application-level tenant predicates exist, but production should add database-enforced isolation.
- No production secrets management is configured. Provider keys, database credentials, OIDC settings, Langfuse keys, and object-storage credentials must come from a managed secret store.
- No hosted deployment target, network policy, TLS termination, or environment promotion policy is configured.
- No real model-provider integration has been security reviewed.
- No data retention policy exists for traces, audit events, prompts, retrieved context, or AI observability events.
- No production incident response, backup, restore, or disaster recovery runbook exists.

## Required Before Real Customer Data

- Replace local trusted OIDC headers with verified bearer-token middleware.
- Enforce tenant isolation in the database with row-level security or equivalent database policies.
- Move customer-data route reads and workflow-changing actions behind authenticated server/API boundaries.
- Add security tests for role permissions, tenant isolation, knowledge entitlement filters, approval gates, and unsafe output blocking.
- Configure production OpenTelemetry and AI observability export with redaction and retention rules.
- Add dependency and container image scanning to CI.
- Document deployment rollback, access review, secret rotation, and incident response procedures.

## Accepted Prototype Risks

- Local fixtures and local development identity are acceptable only for development.
- Deterministic model behavior is acceptable for regression gates until real providers are introduced.
- Local AI observability events are in-memory and non-durable by design.
- Docker Postgres is a local development service, not a production topology.
