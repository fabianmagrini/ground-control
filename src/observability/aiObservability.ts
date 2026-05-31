import type { CopilotRunResult, RetrievedSource, Ticket } from "../domain/types";
import type { IntelligenceRunMode } from "../intelligence/service";

export type AiObservation = {
  id: string;
  kind: "support_copilot_run";
  traceId: string;
  ticketId: string;
  customer: string;
  mode: IntelligenceRunMode;
  promptVersion: string;
  model: string;
  provider: string;
  retrievedSourceIds: string[];
  validationStatus: CopilotRunResult["trace"]["validationStatus"];
  approvalRequired: boolean;
  latencyMs: number;
  estimatedCostUsd: number;
  input: {
    ticketRisk: Ticket["risk"];
    priority: Ticket["priority"];
    messageCount: number;
    keywordCount: number;
  };
  output: {
    confidence: string;
    summaryLength: number;
    draftLength: number;
    citedSourceCount: number;
  };
  metadata: {
    sink: "local" | "langfuse-ready";
    sourceTitles: string[];
  };
};

export type AiObservationSink = {
  record: (observation: AiObservation) => void;
};

const recordedObservations: AiObservation[] = [];

export const localAiObservationSink: AiObservationSink = {
  record(observation) {
    recordedObservations.push(observation);
    if (recordedObservations.length > 100) {
      recordedObservations.shift();
    }

    if (process.env.GROUND_CONTROL_AI_OBSERVABILITY_LOG === "console") {
      console.info("[ai-observability]", JSON.stringify(observation));
    }
  },
};

export function recordSupportRunObservation({
  ticket,
  mode,
  result,
  sources,
  sink = localAiObservationSink,
}: {
  ticket: Ticket;
  mode: IntelligenceRunMode;
  result: CopilotRunResult;
  sources: RetrievedSource[];
  sink?: AiObservationSink;
}) {
  const observation = createSupportRunObservation({ ticket, mode, result, sources });
  sink.record(observation);
  return observation;
}

export function getRecordedAiObservations() {
  return [...recordedObservations];
}

export function createSupportRunObservation({
  ticket,
  mode,
  result,
  sources,
}: {
  ticket: Ticket;
  mode: IntelligenceRunMode;
  result: CopilotRunResult;
  sources: RetrievedSource[];
}): AiObservation {
  const retrieveLatency =
    result.trace.toolCalls.find((toolCall) => toolCall.name === "retrieveApprovedSources")
      ?.latencyMs ?? 0;
  const validationLatency =
    result.trace.toolCalls.find((toolCall) => toolCall.name === "validateCustomerDraft")
      ?.latencyMs ?? 0;

  return {
    id: `OBS-${result.trace.id}`,
    kind: "support_copilot_run",
    traceId: result.trace.id,
    ticketId: ticket.id,
    customer: ticket.customer,
    mode,
    promptVersion: result.trace.promptVersion,
    model: result.trace.model,
    provider: result.trace.provider,
    retrievedSourceIds: result.trace.retrievedSourceIds,
    validationStatus: result.trace.validationStatus,
    approvalRequired: result.approvalRequired,
    latencyMs: retrieveLatency + validationLatency,
    estimatedCostUsd: 0.038,
    input: {
      ticketRisk: ticket.risk,
      priority: ticket.priority,
      messageCount: ticket.messages.length,
      keywordCount: ticket.keywords.length,
    },
    output: {
      confidence: result.confidence,
      summaryLength: result.summary.length,
      draftLength: result.draft.length,
      citedSourceCount: result.trace.retrievedSourceIds.length,
    },
    metadata: {
      sink: process.env.LANGFUSE_PUBLIC_KEY ? "langfuse-ready" : "local",
      sourceTitles: sources.map((source) => source.title),
    },
  };
}
