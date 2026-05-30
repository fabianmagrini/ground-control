import { useState } from "react";
import {
  evals as initialEvals,
  initialApprovals,
  initialAuditEvents,
} from "../../domain/fixtures";
import type { Approval, AuditEvent, EvalCase, Risk } from "../../domain/types";

type ApprovalRequest = {
  ticketId: string;
  customer: string;
  risk: Risk;
  reason: string;
  status: Approval["status"];
};

export function useReviewWorkflow() {
  const [approvals, setApprovals] = useState<Approval[]>(() => structuredClone(initialApprovals));
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() =>
    structuredClone(initialAuditEvents),
  );
  const [evals, setEvals] = useState<EvalCase[]>(() => structuredClone(initialEvals));

  const passCount = evals.filter((item) => item.status === "Pass").length;

  function addAudit(actor: string, event: string) {
    setAuditEvents((items) => [
      {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actor,
        event,
      },
      ...items,
    ]);
  }

  function addApproval(request: ApprovalRequest) {
    setApprovals((items) => [
      ...items,
      {
        id: `APR-${900 + items.length + 1}`,
        ...request,
      },
    ]);
  }

  function resetReviewWorkflow() {
    setApprovals(structuredClone(initialApprovals));
    setAuditEvents(structuredClone(initialAuditEvents));
    setEvals(structuredClone(initialEvals));
  }

  return {
    approvals,
    auditEvents,
    evals,
    passCount,
    addAudit,
    addApproval,
    approveItem: (id: string) => {
      setApprovals((items) =>
        items.map((item) => (item.id === id ? { ...item, status: "Approved" } : item)),
      );
      addAudit("Reviewer", `Approved ${id}.`);
    },
    rejectItem: (id: string) => {
      setApprovals((items) =>
        items.map((item) => (item.id === id ? { ...item, status: "Rejected" } : item)),
      );
      addAudit("Reviewer", `Rejected ${id}.`);
    },
    bulkApproveLowRisk: () => {
      setApprovals((items) =>
        items.map((item) => (item.risk === "High" ? item : { ...item, status: "Approved" })),
      );
      addAudit("Reviewer", "Bulk approved low and medium risk items.");
    },
    runEvals: () => {
      setEvals((items) =>
        items.map((item) => {
          const score = Math.min(100, item.score + (item.status === "Watch" ? 4 : 1));
          return { ...item, score, status: score >= item.threshold ? "Pass" : "Watch" };
        }),
      );
      addAudit("Eval Runner", "Regression suite completed for current prompt version.");
    },
    resetReviewWorkflow,
  };
}
