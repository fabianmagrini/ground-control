# ADR 0014: Add OpenTelemetry Trace Instrumentation

## Status

Accepted

## Context

The app now has API auth, tenant-isolated route data, and an explicit intelligence service. Phase 5 requires observability that can follow requests across API handlers, retrieval, prompt rendering, model routing, generation, validation, and audit-facing metadata.

The project should not commit exporter credentials, collector endpoints, or vendor-specific setup before deployment choices are made.

## Decision

Add `@opentelemetry/api` and a small tracing helper in `src/observability/tracing.ts`.

Instrument:

- API route handlers for tickets, ticket detail, knowledge, and review workflow reads
- support intelligence runs
- prompt rendering
- model routing
- retrieval
- deterministic generation
- output validation

Use stable attributes for tenant, actor, ticket ID, mode, prompt version, model, provider, validation status, approval requirement, and retrieved source IDs.

Do not configure an SDK, exporter, collector, or vendor backend yet. Runtime environments can install an OpenTelemetry SDK/exporter at the process boundary without changing application call sites.

## Consequences

Positive:

- Core service boundaries now emit standard OpenTelemetry spans.
- Instrumentation is vendor-neutral and does not require secrets.
- Future deployment can add OTLP export without refactoring business logic.

Tradeoffs:

- Without an SDK/exporter, spans are no-ops at runtime.
- Browser and server function tracing are still limited until runtime wiring is selected.
- Span naming and attributes should be reviewed before production dashboards are built.

Follow-up:

- Add an SDK bootstrap for server runtime deployments.
- Export traces to an OTLP collector or managed backend.
- Add trace correlation between API, database, intelligence, Langfuse, and eval runs.
