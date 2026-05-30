import { EvalPanel, GatewayPanel, MetricRow } from "../components";
import { useAppState } from "../AppState";

export function ObservabilitySection() {
  const state = useAppState();
  return (
    <section className="section-view active">
      <MetricRow
        metrics={[
          ["Eval pass rate", `${Math.round((state.passCount / state.evals.length) * 100)}%`, "Current prompt version"],
          ["Trace coverage", "100%", "All AI actions audited"],
          ["Fallback events", "3", "Last 24 hours"],
          ["Avg retrieval recall", "93%", "Golden set"],
        ]}
      />
      <div className="ops-grid">
        <EvalPanel evals={state.evals} onRunEvals={state.runEvals} />
        <GatewayPanel />
      </div>
    </section>
  );
}
