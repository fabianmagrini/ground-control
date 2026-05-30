# ADR 0002: Use URL-Backed Route Sections

## Status

Accepted

## Context

The prototype originally switched between app sections with local React state. That was enough for a static demo, but an enterprise console needs addressable views for support, approvals, knowledge operations, observability, and governance.

AI coding agents also need clear ownership boundaries. Route files are a useful place to attach future loaders, server functions, permissions, and feature-specific tests.

## Decision

Use TanStack Router file routes for the main application sections:

- `/support`
- `/approvals`
- `/knowledge`
- `/observability`
- `/governance`

Keep `/` as a redirect to `/support`.

Each route renders the same shell with a route-specific section component. Shared chrome, navigation, and global prototype state stay outside the individual section components.

## Consequences

Positive:

- Each major product area has a stable URL.
- Feature ownership is clearer for future agents.
- Route-level loaders and permissions can be added incrementally.
- Browser navigation, reloads, bookmarks, and direct links behave naturally.

Tradeoffs:

- Cross-route workflow state should eventually move to server-backed data or TanStack Query.
- The next route refinement should add `/support/$ticketId` for ticket deep linking.
