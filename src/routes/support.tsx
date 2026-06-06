import { createFileRoute } from "@tanstack/react-router";
import { GroundControlApp } from "../ui/GroundControlApp";

export const Route = createFileRoute("/support")({
  component: SupportRoute,
});

function SupportRoute() {
  return <GroundControlApp section="support" />;
}
