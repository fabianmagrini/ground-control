import { createFileRoute } from "@tanstack/react-router";
import { GroundControlApp } from "../ui/GroundControlApp";

export const Route = createFileRoute("/governance")({
  component: GovernanceRoute,
});

function GovernanceRoute() {
  return <GroundControlApp section="governance" />;
}
