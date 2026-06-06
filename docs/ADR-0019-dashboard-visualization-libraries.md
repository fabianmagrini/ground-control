# ADR 0019: Use Native Dashboard Components for Observability

## Status

Accepted

## Context

The product includes observability-heavy workflows: eval pass rates, model routing, latency, retrieval quality, guardrail outcomes, approval rates, audit events, traces, and cost signals. A Grafana-style dashboard framework is attractive for these surfaces, but the product is primarily an enterprise support console with workflow actions, human approvals, ticket context, and permission-aware knowledge review.

Using Grafana or a full dashboard framework as the main application surface would create a second UX system and could make support workflows feel bolted onto an observability tool.

## Decision

Build observability dashboards as native React/TanStack Start product surfaces.

Near-term library choices:

- Use TanStack Table for dense operational tables, queues, logs, traces, eval cases, and source lists.
- Use Recharts as the default charting library for product observability panels.
- Keep dashboard panels as typed in-app components and lightweight configuration objects.

Defer heavier dashboard frameworks until production telemetry makes them necessary.

Libraries to reconsider later:

- Apache ECharts for large or highly interactive visualizations.
- visx for custom D3-like React visualizations.
- React Grid Layout for draggable and resizable saved dashboards.
- Grafana Scenes or Grafana embeds for production telemetry dashboards, especially OpenTelemetry, logs, traces, and infra SLOs.

## Consequences

Positive:

- Keeps the support console cohesive and workflow-oriented.
- Lets observability panels share the existing design system, routes, auth model, and product language.
- Avoids committing to dashboard-authoring complexity before users need it.
- Leaves a path to integrate Grafana-compatible telemetry views later.

Tradeoffs:

- The app must own panel composition, chart styling, and dashboard conventions.
- Native panels will not immediately match Grafana's mature dashboard editing, alerting, or data-source ecosystem.
- Advanced time-series and trace exploration may eventually need external observability tooling.

Follow-up:

- Add TanStack Table where queue, log, eval, and trace density warrants it.
- Add Recharts when observability panels need trends or comparisons.
- Re-evaluate Grafana Scenes or embeds once real production telemetry and SLO dashboards exist.
