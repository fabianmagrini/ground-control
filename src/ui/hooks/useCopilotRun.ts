import { useState } from "react";
import {
  createAction,
  createDraft,
  createSummary,
  retrieveSources,
} from "../../domain/copilot";
import type { RetrievedSource, Ticket, TraceStep } from "../../domain/types";

export const EMPTY_DRAFT = "No draft generated yet.";

const EMPTY_SUMMARY =
  "Run Copilot to summarize the issue, retrieve policy context, and draft a response.";
const EMPTY_ACTION = "No action suggested yet.";
const IDLE_CONFIDENCE = "Idle";

export type SystemTab = "trace" | "account" | "tools" | "audit";

export function useCopilotRun(activeTicket: Ticket, addAudit: (actor: string, event: string) => void) {
  const [sources, setSources] = useState<RetrievedSource[]>([]);
  const [trace, setTrace] = useState<TraceStep[]>(idleTrace);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [action, setAction] = useState(EMPTY_ACTION);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [reply, setReply] = useState("");
  const [confidence, setConfidence] = useState(IDLE_CONFIDENCE);
  const [tab, setTab] = useState<SystemTab>("trace");

  function resetCopilot() {
    setSources([]);
    setTrace(idleTrace);
    setSummary(EMPTY_SUMMARY);
    setAction(EMPTY_ACTION);
    setDraft(EMPTY_DRAFT);
    setReply("");
    setConfidence(IDLE_CONFIDENCE);
  }

  function runCopilot() {
    const result = retrieveSources(activeTicket);
    const nextDraft = createDraft(activeTicket, result.sources);
    setSources(result.sources);
    setTrace([
      ...result.trace,
      {
        title: "Model gateway",
        body: "Routed to general-low-latency with fallback enabled, temperature locked, and structured output schema.",
      },
      {
        title: "Guardrail validation",
        body: "Checked citations, unsupported commitments, sensitive data, and whether the response requires human approval.",
      },
    ]);
    setSummary(createSummary(activeTicket));
    setAction(createAction(activeTicket));
    setDraft(nextDraft);
    setConfidence(activeTicket.risk === "High" ? "88% review" : "94% grounded");
    addAudit("Copilot", `Generated grounded assistance for ${activeTicket.id}.`);
  }

  function retrieveForActiveTicket() {
    const result = retrieveSources(activeTicket);
    setSources(result.sources);
    setTrace(result.trace);
  }

  function draftForActiveTicket() {
    const result = retrieveSources(activeTicket);
    setSources(result.sources);
    setTrace(result.trace);
    setDraft(createDraft(activeTicket, result.sources));
  }

  function markReplyApproved() {
    setTrace((items) => [
      ...items,
      {
        title: "Human approval",
        body: "Agent approved the editable draft. The application service would send the message and write an immutable audit event.",
      },
    ]);
    setConfidence("Approved");
  }

  return {
    sources,
    trace,
    summary,
    action,
    draft,
    reply,
    setReply,
    confidence,
    tab,
    setTab,
    runCopilot,
    refreshSummary: () => setSummary(createSummary(activeTicket)),
    refreshAction: () => setAction(createAction(activeTicket)),
    retrieveForActiveTicket,
    draftForActiveTicket,
    insertDraft: () => setReply(draft === EMPTY_DRAFT ? "" : draft),
    markReplyApproved,
    resetCopilot,
  };
}

const idleTrace: TraceStep[] = [
  {
    title: "Waiting for request",
    body: "The intelligence layer has not processed this ticket yet.",
  },
];
