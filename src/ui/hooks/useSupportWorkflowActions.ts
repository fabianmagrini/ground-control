import { useCallback } from "react";
import type { Approval, Ticket } from "../../domain/types";

type ApprovalRequest = Omit<Approval, "id">;

type SupportWorkflowActionsOptions = {
  activeTicket: Ticket;
  reply: string;
  selectTicketById: (ticketId: string) => void;
  updateActiveTicketStatus: (status: Ticket["status"]) => void;
  addApproval: (request: ApprovalRequest) => void;
  addAudit: (actor: string, event: string) => void;
  markReplyApproved: () => void;
  resetTickets: () => void;
  resetReviewWorkflow: () => void;
  resetCopilot: () => void;
};

export function useSupportWorkflowActions({
  activeTicket,
  reply,
  selectTicketById,
  updateActiveTicketStatus,
  addApproval,
  addAudit,
  markReplyApproved,
  resetTickets,
  resetReviewWorkflow,
  resetCopilot,
}: SupportWorkflowActionsOptions) {
  const selectTicket = useCallback(
    (ticketId: string) => {
      selectTicketById(ticketId);
      resetCopilot();
    },
    [resetCopilot, selectTicketById],
  );

  const approveReply = useCallback(() => {
    if (!reply.trim()) return;
    updateActiveTicketStatus("Pending customer");
    markReplyApproved();
    addApproval({
      ticketId: activeTicket.id,
      customer: activeTicket.customer,
      risk: activeTicket.risk,
      reason: "Approved customer response with AI assistance",
      status: "Approved",
    });
    addAudit("Fabian", `Approved AI-assisted reply for ${activeTicket.id}.`);
  }, [
    activeTicket.customer,
    activeTicket.id,
    activeTicket.risk,
    addApproval,
    addAudit,
    markReplyApproved,
    reply,
    updateActiveTicketStatus,
  ]);

  const escalateTicket = useCallback(() => {
    updateActiveTicketStatus("Waiting on Engineering");
    addApproval({
      ticketId: activeTicket.id,
      customer: activeTicket.customer,
      risk: activeTicket.risk,
      reason: "Workflow tool createEscalation requires approval",
      status: "Awaiting review",
    });
    addAudit("Fabian", `Requested escalation approval for ${activeTicket.id}.`);
  }, [
    activeTicket.customer,
    activeTicket.id,
    activeTicket.risk,
    addApproval,
    addAudit,
    updateActiveTicketStatus,
  ]);

  const resetDemo = useCallback(() => {
    resetTickets();
    resetReviewWorkflow();
    resetCopilot();
  }, [resetCopilot, resetReviewWorkflow, resetTickets]);

  return {
    selectTicket,
    approveReply,
    escalateTicket,
    resetDemo,
  };
}
