import { createContext, useContext } from "react";
import { knowledgeBase } from "../domain/fixtures";
import type {
  Approval,
  AuditEvent,
  EvalCase,
  RetrievedSource,
  Ticket,
  TraceStep,
} from "../domain/types";
import { useCopilotRun, type SystemTab } from "./hooks/useCopilotRun";
import { useKnowledgeSearch } from "./hooks/useKnowledgeSearch";
import { useReviewWorkflow } from "./hooks/useReviewWorkflow";
import { useSupportTickets, type Metric } from "./hooks/useSupportTickets";

export type Bootstrap = {
  appName: string;
  environment: string;
};

type AppStateValue = {
  bootstrap: Bootstrap;
  tickets: Ticket[];
  activeTicket: Ticket;
  queueFilter: string;
  setQueueFilter: (value: string) => void;
  filteredTickets: Ticket[];
  sources: RetrievedSource[];
  trace: TraceStep[];
  summary: string;
  action: string;
  draft: string;
  reply: string;
  setReply: (value: string) => void;
  confidence: string;
  tab: SystemTab;
  setTab: (value: SystemTab) => void;
  approvals: Approval[];
  auditEvents: AuditEvent[];
  evals: EvalCase[];
  passCount: number;
  knowledgeQuery: string;
  setKnowledgeQuery: (value: string) => void;
  filteredKnowledge: typeof knowledgeBase;
  metrics: readonly Metric[];
  selectTicket: (ticketId: string) => void;
  runCopilot: () => void;
  refreshSummary: () => void;
  refreshAction: () => void;
  retrieveForActiveTicket: () => void;
  draftForActiveTicket: () => void;
  insertDraft: () => void;
  approveReply: () => void;
  escalateTicket: () => void;
  approveItem: (id: string) => void;
  rejectItem: (id: string) => void;
  bulkApproveLowRisk: () => void;
  runEvals: () => void;
  resetDemo: () => void;
};

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({
  bootstrap,
  children,
}: {
  bootstrap: Bootstrap;
  children: React.ReactNode;
}) {
  const review = useReviewWorkflow();
  const tickets = useSupportTickets();
  const copilot = useCopilotRun(tickets.activeTicket, review.addAudit);
  const knowledge = useKnowledgeSearch();

  function selectTicket(ticketId: string) {
    tickets.selectTicket(ticketId);
    copilot.resetCopilot();
  }

  function approveReply() {
    if (!copilot.reply.trim()) return;
    tickets.updateActiveTicketStatus("Pending customer");
    copilot.markReplyApproved();
    review.addApproval({
      ticketId: tickets.activeTicket.id,
      customer: tickets.activeTicket.customer,
      risk: tickets.activeTicket.risk,
      reason: "Approved customer response with AI assistance",
      status: "Approved",
    });
    review.addAudit("Fabian", `Approved AI-assisted reply for ${tickets.activeTicket.id}.`);
  }

  function escalateTicket() {
    tickets.updateActiveTicketStatus("Waiting on Engineering");
    review.addApproval({
      ticketId: tickets.activeTicket.id,
      customer: tickets.activeTicket.customer,
      risk: tickets.activeTicket.risk,
      reason: "Workflow tool createEscalation requires approval",
      status: "Awaiting review",
    });
    review.addAudit("Fabian", `Requested escalation approval for ${tickets.activeTicket.id}.`);
  }

  function resetDemo() {
    tickets.resetTickets();
    review.resetReviewWorkflow();
    copilot.resetCopilot();
  }

  const value: AppStateValue = {
    bootstrap,
    tickets: tickets.tickets,
    activeTicket: tickets.activeTicket,
    queueFilter: tickets.queueFilter,
    setQueueFilter: tickets.setQueueFilter,
    filteredTickets: tickets.filteredTickets,
    sources: copilot.sources,
    trace: copilot.trace,
    summary: copilot.summary,
    action: copilot.action,
    draft: copilot.draft,
    reply: copilot.reply,
    setReply: copilot.setReply,
    confidence: copilot.confidence,
    tab: copilot.tab,
    setTab: copilot.setTab,
    approvals: review.approvals,
    auditEvents: review.auditEvents,
    evals: review.evals,
    passCount: review.passCount,
    knowledgeQuery: knowledge.knowledgeQuery,
    setKnowledgeQuery: knowledge.setKnowledgeQuery,
    filteredKnowledge: knowledge.filteredKnowledge,
    metrics: tickets.metrics,
    selectTicket,
    runCopilot: copilot.runCopilot,
    refreshSummary: copilot.refreshSummary,
    refreshAction: copilot.refreshAction,
    retrieveForActiveTicket: copilot.retrieveForActiveTicket,
    draftForActiveTicket: copilot.draftForActiveTicket,
    insertDraft: copilot.insertDraft,
    approveReply,
    escalateTicket,
    approveItem: review.approveItem,
    rejectItem: review.rejectItem,
    bulkApproveLowRisk: review.bulkApproveLowRisk,
    runEvals: review.runEvals,
    resetDemo,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}
