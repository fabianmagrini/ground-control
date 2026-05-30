import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOpsApp } from "../ui/IntelligenceOpsApp";

export const Route = createFileRoute("/observability")({
  component: ObservabilityRoute,
});

function ObservabilityRoute() {
  return <IntelligenceOpsApp section="observability" />;
}
