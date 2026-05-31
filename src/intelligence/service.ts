import {
  auditEventSchema,
  copilotRunResultSchema,
} from "../../packages/contracts/src";
import type {
  CopilotRunResult,
  KnowledgeSource,
  Ticket,
  TraceStep,
} from "../domain/types";
import { generateSupportOutput, routeSupportModel } from "./modelGateway";
import { renderSupportPrompt } from "./promptRegistry";
import { retrieveSourcesForTicket } from "./retrieval";
import { validateSupportOutput } from "./validators";

export type IntelligenceRunMode = "summarize" | "retrieve" | "draft" | "validate" | "full";

export function runSupportIntelligence({
  ticket,
  knowledgeSources,
  mode = "full",
  actor = "Copilot",
}: {
  ticket: Ticket;
  knowledgeSources: KnowledgeSource[];
  mode?: IntelligenceRunMode;
  actor?: string;
}): CopilotRunResult {
  const prompt = renderSupportPrompt({ ticket, mode });
  const gateway = routeSupportModel(prompt);
  const retrieval = retrieveSourcesForTicket({ ticket, knowledgeSources });
  const output = generateSupportOutput({ ticket, sources: retrieval.sources });
  const validation = validateSupportOutput({ ticket, output, sources: retrieval.sources });
  const traceSteps = buildTraceSteps({
    ticket,
    promptVersion: prompt.version,
    renderedPrompt: prompt.renderedUser,
    retrievalTrace: retrieval.trace,
    gatewayModel: gateway.model,
    fallbackModel: gateway.fallbackModel,
    validationTrace: validation.trace,
  });

  return copilotRunResultSchema.parse({
    ticketId: ticket.id,
    summary: output.summary,
    action: output.action,
    draft: output.draft,
    confidence: validation.status === "Blocked" ? "Blocked" : output.confidence,
    sources: retrieval.sources,
    trace: {
      id: `TRACE-${ticket.id}`,
      ticketId: ticket.id,
      promptVersion: prompt.version,
      model: gateway.model,
      provider: gateway.provider,
      steps: traceSteps,
      retrievedSourceIds: retrieval.sources.map((source) => source.id),
      toolCalls: [
        {
          id: `TOOL-${ticket.id}-retrieve`,
          name: "retrieveApprovedSources",
          status: "Completed",
          input: {
            ticketId: ticket.id,
            mode,
            access: "permission-aware",
          },
          output: {
            sourceIds: retrieval.sources.map((source) => source.id),
          },
          latencyMs: 84,
        },
        {
          id: `TOOL-${ticket.id}-validate`,
          name: "validateCustomerDraft",
          status: validation.status === "Blocked" ? "Failed" : "Completed",
          input: {
            sourceIds: retrieval.sources.map((source) => source.id),
          },
          output: {
            validationStatus: validation.status,
          },
          latencyMs: 31,
        },
      ],
      validationStatus: validation.status,
    },
    auditEvent: auditEventSchema.parse({
      time: "now",
      actor,
      event: `Generated ${mode} intelligence run for ${ticket.id} with prompt ${prompt.version}.`,
    }),
    approvalRequired: output.approvalRequired || validation.status !== "Pass",
  });
}

export function retrieveSupportSources({
  ticket,
  knowledgeSources,
}: {
  ticket: Ticket;
  knowledgeSources: KnowledgeSource[];
}) {
  return retrieveSourcesForTicket({ ticket, knowledgeSources });
}

function buildTraceSteps({
  ticket,
  promptVersion,
  renderedPrompt,
  retrievalTrace,
  gatewayModel,
  fallbackModel,
  validationTrace,
}: {
  ticket: Ticket;
  promptVersion: string;
  renderedPrompt: string;
  retrievalTrace: TraceStep[];
  gatewayModel: string;
  fallbackModel: string;
  validationTrace: TraceStep;
}) {
  return [
    {
      title: "Request received",
      body: `Ticket ${ticket.id}, role Support Lead, actions summarize + retrieve + draft + validate.`,
    },
    {
      title: "Prompt registry",
      body: `Loaded support-copilot prompt ${promptVersion}; rendered user prompt: ${renderedPrompt}`,
    },
    ...retrievalTrace,
    {
      title: "Model gateway",
      body: `Routed to ${gatewayModel} with ${fallbackModel} fallback, temperature locked to 0, and structured output schema enforcement.`,
    },
    validationTrace,
  ];
}
