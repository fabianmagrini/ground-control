import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ticketsRouteDataQueryOptions } from "../../domain/routeData";
import type { Ticket } from "../../domain/types";

export type Metric = readonly [string, number | string, string];

export function useSupportTickets() {
  const { data: ticketRouteData } = useQuery(ticketsRouteDataQueryOptions);
  const [tickets, setTickets] = useState<Ticket[]>(() => structuredClone(ticketRouteData));
  const [activeTicketId, setActiveTicketId] = useState(ticketRouteData[0].id);
  const [queueFilter, setQueueFilter] = useState("all");

  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? tickets[0];

  const filteredTickets = tickets.filter((ticket) => {
    if (queueFilter === "all") return true;
    if (queueFilter === "Enterprise") return ticket.plan === "Enterprise";
    if (queueFilter === "Pending customer") return ticket.status === "Pending customer";
    return ticket.priority === queueFilter;
  });

  const metrics = useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status !== "Resolved").length;
    const p1 = tickets.filter((ticket) => ticket.priority === "P1").length;
    const atRisk = tickets.filter((ticket) => ticket.risk === "High").length;
    const enterprise = tickets.filter((ticket) => ticket.plan === "Enterprise").length;
    return [
      ["Open cases", open, "Across assigned queues"],
      ["P1 incidents", p1, "Require active ownership"],
      ["At-risk accounts", atRisk, "High renewal or SLA risk"],
      ["Enterprise cases", enterprise, "Custom terms may apply"],
    ] as const;
  }, [tickets]);

  function selectTicket(ticketId: string) {
    setActiveTicketId(ticketId);
  }

  function updateActiveTicketStatus(status: Ticket["status"]) {
    setTickets((items) =>
      items.map((ticket) => (ticket.id === activeTicket.id ? { ...ticket, status } : ticket)),
    );
  }

  function resetTickets() {
    setTickets(structuredClone(ticketRouteData));
    setActiveTicketId(ticketRouteData[0].id);
    setQueueFilter("all");
  }

  return {
    tickets,
    activeTicket,
    queueFilter,
    setQueueFilter,
    filteredTickets,
    metrics,
    selectTicket,
    updateActiveTicketStatus,
    resetTickets,
  };
}
