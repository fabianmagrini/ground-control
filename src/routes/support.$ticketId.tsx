import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceOpsApp } from "../ui/IntelligenceOpsApp";

export const Route = createFileRoute("/support/$ticketId")({
  component: SupportTicketRoute,
});

function SupportTicketRoute() {
  const { ticketId } = Route.useParams();

  return <IntelligenceOpsApp section="support" ticketId={ticketId} />;
}
