import { useState } from "react";
import {
  retrieveSupportSources,
  runSupportIntelligence,
} from "../../intelligence/service";
import type { KnowledgeSource, RetrievedSource, Ticket, TraceStep } from "../../domain/types";

export const EMPTY_DRAFT = "No draft generated yet.";

const EMPTY_SUMMARY =
  "Run Copilot to summarize the issue, retrieve policy context, and draft a response.";
const EMPTY_ACTION = "No action suggested yet.";
const IDLE_CONFIDENCE = "Idle";

export type SystemTab = "trace" | "account" | "tools" | "audit";

export function useCopilotRun({
  activeTicket,
  knowledgeSources,
  addAudit,
}: {
  activeTicket: Ticket;
  knowledgeSources: KnowledgeSource[];
  addAudit: (actor: string, event: string) => void;
}) {
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
    const result = runSupportIntelligence({
      ticket: activeTicket,
      knowledgeSources,
      mode: "full",
    });

    setSources(result.sources);
    setTrace(result.trace.steps);
    setSummary(result.summary);
    setAction(result.action);
    setDraft(result.draft);
    setConfidence(result.confidence);
    addAudit(result.auditEvent.actor, result.auditEvent.event);
  }

  function retrieveForActiveTicket() {
    const result = retrieveSupportSources({ ticket: activeTicket, knowledgeSources });
    setSources(result.sources);
    setTrace(result.trace);
  }

  function draftForActiveTicket() {
    const result = runSupportIntelligence({
      ticket: activeTicket,
      knowledgeSources,
      mode: "draft",
    });

    setSources(result.sources);
    setTrace(result.trace.steps);
    setDraft(result.draft);
    setConfidence(result.confidence);
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
    retrieveForActiveTicket,
    draftForActiveTicket,
    insertDraft: () => setReply(draft === EMPTY_DRAFT ? "" : draft),
    markReplyApproved,
    resetCopilot,
    refreshSummary: () => {
      const result = runSupportIntelligence({
        ticket: activeTicket,
        knowledgeSources,
        mode: "summarize",
      });
      setSummary(result.summary);
      setTrace(result.trace.steps);
      setConfidence(result.confidence);
    },
    refreshAction: () => {
      const result = runSupportIntelligence({
        ticket: activeTicket,
        knowledgeSources,
        mode: "validate",
      });
      setAction(result.action);
      setTrace(result.trace.steps);
      setConfidence(result.confidence);
    },
  };
}

const idleTrace: TraceStep[] = [
  {
    title: "Waiting for request",
    body: "The intelligence layer has not processed this ticket yet.",
  },
];
