# ADR 0018: Add Production Security Review Gate

## Status

Accepted

## Context

The prototype now includes API auth policy, tenant-scoped data reads, observability, CI gates, and deterministic evals. Before real customer data, hosted deployment, real model providers, or production integrations are introduced, the project needs an explicit production security review artifact.

## Decision

Add `docs/SECURITY_REVIEW.md` as the production security review gate.

The review records:

- current controls
- dependency audit result
- release blockers
- requirements before real customer data
- accepted prototype-only risks

Treat the current status as not production-ready. The security review must be updated before enabling real SSO, real model providers, persistent customer data, hosted observability, production deployment, or external integrations.

## Consequences

Positive:

- Makes production readiness explicit instead of implied by completed backlog work.
- Separates prototype controls from production requirements.
- Creates a concrete checklist for future security work and deployment approval.

Tradeoffs:

- The review is a documentation gate, not an automated security scanner.
- Some blockers remain intentionally unresolved until hosting, identity provider, and secret-management choices are made.

Follow-up:

- Add automated dependency and container scanning in CI.
- Add authorization and tenant-isolation test coverage.
- Update the review when production deployment architecture is selected.
