# ADR 0012: Add OIDC-Shaped API Auth With RBAC and ABAC

## Status

Accepted

## Context

The API service now exposes ticket, knowledge, and review-workflow route data. Before these endpoints become production-facing, they need an explicit authentication and authorization boundary.

The target product requires enterprise SSO/OIDC, role-based access control, and attribute-based access control. Real IdP wiring requires issuer, audience, keys, and deployment choices that should not be hard-coded into the prototype.

## Decision

Add `src/auth` with:

- shared OIDC-shaped identity parsing
- local development identity
- RBAC permissions by role
- ABAC filters for ticket regions and knowledge entitlements
- Hono middleware that attaches an authenticated identity to API requests

The local API accepts trusted claims through the `x-ground-control-oidc-claims` header for development and testing. In non-production development, requests without the header use a local admin identity. Production must verify OIDC tokens before claims are trusted.

Do not add a real SSO provider, client secret, JWKS fetcher, or hosted login flow yet.

## Consequences

Positive:

- API routes now have a concrete auth boundary.
- Authorization rules are testable without a real identity provider.
- RBAC and ABAC are represented as product concepts rather than UI-only assumptions.
- The implementation keeps provider secrets out of browser and source code.

Tradeoffs:

- Local trusted claims are not a production authentication mechanism.
- Token verification, key rotation, login redirects, and session management still need deployment-specific work.
- TanStack server functions still use prototype-local state and should be moved behind the API or shared auth-aware services later.

Follow-up:

- Add tenant isolation to every database query.
- Add real OIDC token verification at the API boundary.
- Add authorization tests for each role and sensitive endpoint.
