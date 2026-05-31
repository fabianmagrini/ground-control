# ADR 0016: Add Intelligence Eval Regression Gates

## Status

Accepted

## Context

The intelligence service now has prompt routing, retrieval, structured outputs, validators, traces, and AI observability events. Changes to any of those pieces can regress groundedness, citations, approval gates, or safety behavior even when UI smoke tests still pass.

The project needs a local deterministic gate before adding real model providers or production retrieval.

## Decision

Add deterministic support Copilot regression evals in `src/evals/supportRegression.ts` and expose them through `npm run evals`.

The eval gate runs the intelligence service over the prototype support tickets and checks:

- grounded answer citations
- required governance citation
- structured trace metadata
- human approval gates for risky cases
- prompt-injection resistance

The runner exits nonzero if any check fails.

## Consequences

Positive:

- Intelligence behavior now has a fast local regression gate.
- The gate covers AI-specific risks that UI smoke tests do not evaluate.
- Future CI can run the same command without a database or model provider.

Tradeoffs:

- The eval set is small and fixture-based.
- Deterministic local generation does not measure real model variance.
- Scores are binary today; richer metrics can be added when real outputs exist.

Follow-up:

- Add CI enforcement for `npm run evals`.
- Add persisted eval runs and history once database-backed eval workflows are active.
- Expand cases for prompt injection, retrieval misses, and unsupported commitments.
