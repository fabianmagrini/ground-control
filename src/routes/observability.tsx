import { createFileRoute } from "@tanstack/react-router";
import { GroundControlApp } from "../ui/GroundControlApp";

export const Route = createFileRoute("/observability")({
  component: ObservabilityRoute,
});

function ObservabilityRoute() {
  return <GroundControlApp section="observability" />;
}
