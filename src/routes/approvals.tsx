import { createFileRoute } from "@tanstack/react-router";
import { GroundControlApp } from "../ui/GroundControlApp";

export const Route = createFileRoute("/approvals")({
  component: ApprovalsRoute,
});

function ApprovalsRoute() {
  return <GroundControlApp section="approvals" />;
}
