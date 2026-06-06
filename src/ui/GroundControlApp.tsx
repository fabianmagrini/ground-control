import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { useAppState } from "./AppState";
import { sectionConfig } from "../domain/navigation";
import type { Section } from "../domain/types";
import { AppShell } from "./components";
import { ApprovalsSection } from "./sections/ApprovalsSection";
import { GovernanceSection } from "./sections/GovernanceSection";
import { KnowledgeSection } from "./sections/KnowledgeSection";
import { ObservabilitySection } from "./sections/ObservabilitySection";
import { SupportSection } from "./sections/SupportSection";

type Props = {
  section: Section;
  ticketId?: string;
};

export function GroundControlApp({ section, ticketId }: Props) {
  return <RoutedConsole section={section} ticketId={ticketId} />;
}

function RoutedConsole({ section, ticketId }: { section: Section; ticketId?: string }) {
  const { activeTicket, selectTicket, tickets } = useAppState();
  const location = useLocation();
  const config = sectionConfig[section];
  const title = section === "support" ? activeTicket.title : config.title;
  const routedTicketId = ticketId ?? getSupportTicketId(location.pathname);

  useEffect(() => {
    if (!routedTicketId || activeTicket.id === routedTicketId) return;
    if (!tickets.some((ticket) => ticket.id === routedTicketId)) return;
    selectTicket(routedTicketId);
  }, [activeTicket.id, routedTicketId, selectTicket, tickets]);

  return (
    <AppShell eyebrow={config.eyebrow} section={section} title={title}>
      {section === "support" && <SupportSection />}
      {section === "approvals" && <ApprovalsSection />}
      {section === "knowledge" && <KnowledgeSection />}
      {section === "observability" && <ObservabilitySection />}
      {section === "governance" && <GovernanceSection />}
    </AppShell>
  );
}

function getSupportTicketId(pathname: string) {
  const match = pathname.match(/^\/support\/([^/]+)$/);
  return match?.[1];
}
