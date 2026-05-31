# ADR 0015: Add Vendor-Neutral AI Observability Events

## Status

Accepted

## Context

The intelligence service now emits OpenTelemetry spans, but AI-specific observability also needs prompt versions, model/provider metadata, retrieved sources, validation outcomes, approval requirements, latency, cost, and output shape. Langfuse is a preferred target, but wiring a hosted backend requires keys, host selection, retention policy, and deployment decisions.

## Decision

Add a vendor-neutral AI observability boundary in `src/observability/aiObservability.ts`.

The support Copilot intelligence run now records an `AiObservation` event with:

- trace ID and ticket ID
- prompt version
- model and provider
- retrieved source IDs and titles
- validation status
- approval requirement
- latency and estimated cost
- input risk/priority/message counts
- output confidence, summary length, draft length, and citation count

Use an in-process local sink by default. The sink keeps recent observations in memory and can optionally log JSON events with `GROUND_CONTROL_AI_OBSERVABILITY_LOG=console`.

Treat the event schema as Langfuse-ready, but do not add the Langfuse SDK or transmit data until deployment credentials and data-retention requirements are approved.

## Consequences

Positive:

- AI runs now produce structured observability events separate from user-facing traces.
- The schema can map cleanly to Langfuse traces/generations/scores later.
- Local development remains deterministic and does not require secrets.

Tradeoffs:

- In-memory observations are not durable.
- No hosted AI observability backend receives data yet.
- Cost and latency are prototype estimates until real model and retrieval services are connected.

Follow-up:

- Add a Langfuse sink behind explicit environment configuration.
- Persist AI observations or export them through the OpenTelemetry collector.
- Add eval feedback and human review outcomes to observations.
