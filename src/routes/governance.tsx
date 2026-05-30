import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOpsApp } from "../ui/IntelligenceOpsApp";

export const Route = createFileRoute("/governance")({
  component: GovernanceRoute,
});

function GovernanceRoute() {
  return <IntelligenceOpsApp section="governance" />;
}
