import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOpsApp } from "../ui/IntelligenceOpsApp";

export const Route = createFileRoute("/support")({
  component: SupportRoute,
});

function SupportRoute() {
  return <IntelligenceOpsApp section="support" />;
}
