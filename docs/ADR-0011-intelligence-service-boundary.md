# ADR 0011: Add an Intelligence Service Boundary

## Status

Accepted

## Context

The prototype needs a real intelligence-layer shape before adding external model providers, production retrieval, or workflow-changing tools. Existing Copilot behavior lived directly in UI-facing domain helpers and used fixture data directly.

The product intent requires the intelligence layer to own context assembly, retrieval, model/tool orchestration, validation, traces, citations, and eval metadata while the app owns truth and approved actions.

## Decision

Add `src/intelligence` as the first intelligence service boundary.

The boundary includes:

- prompt registry and prompt versioning
- model-gateway routing with deterministic local generation
- structured output parsing
- permission-aware source retrieval
- pgvector-ready Postgres retrieval SQL shape
- source citation enforcement
- output validators for citations, sensitive data, unsupported commitments, and approval requirements
- trace and audit metadata generation

Keep model generation deterministic and local. Do not call real model providers, load secrets, or let browser code execute privileged tools.

The UI Copilot hook now calls the intelligence service and passes route-loaded knowledge sources instead of reading fixture data through Copilot helpers.

## Consequences

Positive:

- Gives the app a clear intelligence-layer integration point.
- Keeps provider choice, prompt versions, retrieval, and validation outside the UI.
- Preserves current demo behavior while making traces and validators more explicit.
- Leaves a direct path to replace deterministic generation with a real model gateway later.

Tradeoffs:

- Retrieval still runs in-memory for the browser-backed demo path until database mode is fully exercised.
- The pgvector SQL is a contract shape, not yet wired to a live retrieval endpoint.
- Deterministic generation is useful for smoke tests but does not validate real model behavior.

Follow-up:

- Move intelligence execution behind server functions or API handlers before adding real providers.
- Store intelligence runs, citations, validation results, and feedback in Postgres.
- Add regression evals for prompt versions and validator outcomes.
