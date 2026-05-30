# ADR 0001: Use TanStack Start and TypeScript

## Status

Accepted

## Context

The product is an enterprise support console with a visible intelligence layer. It needs routing, server functions, typed data loading, rich tables, forms, workflow states, and strong API contracts. The user explicitly prefers not to use Next.js and wants TypeScript where practical.

## Decision

Use TanStack Start with React and TypeScript for the web application.

Use TypeScript for app code, server functions, API contracts, tool schemas, structured AI outputs, workflow state, and eval schemas.

Keep the intelligence layer service TypeScript-first initially. Introduce Python only if specialized ingestion or data-science workflows justify it.

## Consequences

Positive:

- Strong fit with TanStack Router, Query, Table, and Form.
- Clear route-centric enterprise app structure.
- Shared TypeScript contracts across web, API, and intelligence services.
- Avoids Next.js-specific conventions.

Tradeoffs:

- Smaller ecosystem than Next.js.
- Some deployment and testing patterns may need more explicit setup.
- Team and AI agents should rely on official TanStack docs when implementing framework-specific behavior.
