import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOpsApp } from "../ui/IntelligenceOpsApp";

export const Route = createFileRoute("/knowledge")({
  component: KnowledgeRoute,
});

function KnowledgeRoute() {
  return <IntelligenceOpsApp section="knowledge" />;
}
