import { createFileRoute } from "@tanstack/react-router";
import { GroundControlApp } from "../ui/GroundControlApp";

export const Route = createFileRoute("/knowledge")({
  component: KnowledgeRoute,
});

function KnowledgeRoute() {
  return <GroundControlApp section="knowledge" />;
}
