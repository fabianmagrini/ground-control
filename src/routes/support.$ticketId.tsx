import { createFileRoute } from "@tanstack/react-router";
import { GroundControlApp } from "../ui/GroundControlApp";

export const Route = createFileRoute("/support/$ticketId")({
  component: SupportTicketRoute,
});

function SupportTicketRoute() {
  const { ticketId } = Route.useParams();

  return <GroundControlApp section="support" ticketId={ticketId} />;
}
