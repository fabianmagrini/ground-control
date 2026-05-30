import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOpsApp } from "../ui/IntelligenceOpsApp";

export const Route = createFileRoute("/approvals")({
  component: ApprovalsRoute,
});

function ApprovalsRoute() {
  return <IntelligenceOpsApp section="approvals" />;
}
