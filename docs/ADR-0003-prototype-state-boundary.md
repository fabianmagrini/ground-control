# ADR 0003: Keep Prototype State in a Dedicated AppState Context

## Status

Accepted

## Context

The app is still using simulated tickets, approvals, audit events, evals, retrieval results, and Copilot outputs. Before adding a database or real API, the prototype needs one clear place for state transitions so UI components do not each invent their own local workflow logic.

## Decision

Keep prototype state in `src/ui/AppState.tsx`.

This file exposes:

- Active ticket selection
- Queue filtering
- Copilot run state
- Retrieved sources
- Trace steps
- Draft reply state
- Approval and escalation transitions
- Audit events
- Eval run mutation
- Knowledge search text

Feature components consume state and actions through `useAppState()`.

Implementation note:

`AppState.tsx` now acts as the compatibility boundary for the UI-facing context. Domain-specific state lives in focused hooks under `src/ui/hooks`, including ticket state, Copilot run state, review workflow state, and knowledge search state.

## Consequences

Positive:

- The app behavior is easier to reason about during migration.
- Feature components stay mostly presentational.
- Future server-function migration has a clear source of current behavior.
- AI coding agents can find workflow transitions in one file.

Tradeoffs:

- App state is still client-local and not durable.
- Cross-workflow actions still need composition at the context boundary.

Follow-up:

- Move server-owned workflow actions into TanStack Start server functions.
- Replace local state with TanStack Query once server-backed data exists.
- Keep `AppState.tsx` as a temporary migration bridge, not a permanent architecture.
