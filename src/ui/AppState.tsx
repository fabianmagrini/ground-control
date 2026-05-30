import { createContext, useContext, useMemo, useState } from "react";
import {
  createAction,
  createDraft,
  createSummary,
  retrieveSources,
} from "../domain/copilot";
import {
  evals as initialEvals,
  initialApprovals,
  initialAuditEvents,
  initialTickets,
  knowledgeBase,
} from "../domain/fixtures";
import type {
  Approval,
  AuditEvent,
  EvalCase,
  RetrievedSource,
  Ticket,
  TraceStep,
} from "../domain/types";

export type Bootstrap = {
  appName: string;
  environment: string;
};

export type SystemTab = "trace" | "account" | "tools" | "audit";

type Metric = readonly [string, number | string, string];

const EMPTY_SUMMARY =
  "Run Copilot to summarize the issue, retrieve policy context, and draft a response.";
const EMPTY_ACTION = "No action suggested yet.";
const EMPTY_DRAFT = "No draft generated yet.";
const IDLE_CONFIDENCE = "Idle";

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
  const [tickets, setTickets] = useState<Ticket[]>(() => structuredClone(initialTickets));
  const [activeTicketId, setActiveTicketId] = useState(initialTickets[0].id);
  const [queueFilter, setQueueFilter] = useState("all");
  const [sources, setSources] = useState<RetrievedSource[]>([]);
  const [trace, setTrace] = useState<TraceStep[]>([
    {
      title: "Waiting for request",
      body: "The intelligence layer has not processed this ticket yet.",
    },
  ]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [action, setAction] = useState(EMPTY_ACTION);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [reply, setReply] = useState("");
  const [confidence, setConfidence] = useState(IDLE_CONFIDENCE);
  const [tab, setTab] = useState<SystemTab>("trace");
  const [approvals, setApprovals] = useState<Approval[]>(() => structuredClone(initialApprovals));
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() =>
    structuredClone(initialAuditEvents),
  );
  const [evals, setEvals] = useState<EvalCase[]>(() => structuredClone(initialEvals));
  const [knowledgeQuery, setKnowledgeQuery] = useState("");

  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? tickets[0];

  const filteredTickets = tickets.filter((ticket) => {
    if (queueFilter === "all") return true;
    if (queueFilter === "Enterprise") return ticket.plan === "Enterprise";
    if (queueFilter === "Pending customer") return ticket.status === "Pending customer";
    return ticket.priority === queueFilter;
  });

  const filteredKnowledge = knowledgeBase.filter((source) =>
    `${source.id} ${source.title} ${source.topic} ${source.body} ${source.owner}`
      .toLowerCase()
      .includes(knowledgeQuery.toLowerCase()),
  );

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

  function resetCopilot() {
    setSources([]);
    setTrace([
      {
        title: "Waiting for request",
        body: "The intelligence layer has not processed this ticket yet.",
      },
    ]);
    setSummary(EMPTY_SUMMARY);
    setAction(EMPTY_ACTION);
    setDraft(EMPTY_DRAFT);
    setReply("");
    setConfidence(IDLE_CONFIDENCE);
  }

  function selectTicket(ticketId: string) {
    setActiveTicketId(ticketId);
    resetCopilot();
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

  function approveReply() {
    if (!reply.trim()) return;
    setTickets((items) =>
      items.map((ticket) =>
        ticket.id === activeTicket.id ? { ...ticket, status: "Pending customer" } : ticket,
      ),
    );
    setTrace((items) => [
      ...items,
      {
        title: "Human approval",
        body: "Agent approved the editable draft. The application service would send the message and write an immutable audit event.",
      },
    ]);
    setApprovals((items) => [
      ...items,
      {
        id: `APR-${900 + items.length + 1}`,
        ticketId: activeTicket.id,
        customer: activeTicket.customer,
        risk: activeTicket.risk,
        reason: "Approved customer response with AI assistance",
        status: "Approved",
      },
    ]);
    setConfidence("Approved");
    addAudit("Fabian", `Approved AI-assisted reply for ${activeTicket.id}.`);
  }

  function escalateTicket() {
    setTickets((items) =>
      items.map((ticket) =>
        ticket.id === activeTicket.id ? { ...ticket, status: "Waiting on Engineering" } : ticket,
      ),
    );
    setApprovals((items) => [
      ...items,
      {
        id: `APR-${900 + items.length + 1}`,
        ticketId: activeTicket.id,
        customer: activeTicket.customer,
        risk: activeTicket.risk,
        reason: "Workflow tool createEscalation requires approval",
        status: "Awaiting review",
      },
    ]);
    addAudit("Fabian", `Requested escalation approval for ${activeTicket.id}.`);
  }

  function resetDemo() {
    setTickets(structuredClone(initialTickets));
    setActiveTicketId(initialTickets[0].id);
    setApprovals(structuredClone(initialApprovals));
    setAuditEvents(structuredClone(initialAuditEvents));
    setEvals(structuredClone(initialEvals));
    setQueueFilter("all");
    resetCopilot();
  }

  const value: AppStateValue = {
    bootstrap,
    tickets,
    activeTicket,
    queueFilter,
    setQueueFilter,
    filteredTickets,
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
    approvals,
    auditEvents,
    evals,
    passCount,
    knowledgeQuery,
    setKnowledgeQuery,
    filteredKnowledge,
    metrics,
    selectTicket,
    runCopilot,
    refreshSummary: () => setSummary(createSummary(activeTicket)),
    refreshAction: () => setAction(createAction(activeTicket)),
    retrieveForActiveTicket,
    draftForActiveTicket,
    insertDraft: () => setReply(draft === EMPTY_DRAFT ? "" : draft),
    approveReply,
    escalateTicket,
    approveItem: (id) => {
      setApprovals((items) =>
        items.map((item) => (item.id === id ? { ...item, status: "Approved" } : item)),
      );
      addAudit("Reviewer", `Approved ${id}.`);
    },
    rejectItem: (id) => {
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
