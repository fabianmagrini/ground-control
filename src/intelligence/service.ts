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
import { recordSupportRunObservation } from "../observability/aiObservability";
import { withSpan } from "../observability/tracing";

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
  return withSpan("intelligence.support.run", {
    "app.ticket_id": ticket.id,
    "app.customer": ticket.customer,
    "app.mode": mode,
    "app.actor": actor,
    "app.ticket_risk": ticket.risk,
    "app.knowledge_source_count": knowledgeSources.length,
  }, (span) => {
    const prompt = withSpan("intelligence.prompt.render", {
      "app.ticket_id": ticket.id,
      "app.mode": mode,
    }, () => renderSupportPrompt({ ticket, mode }));
    const gateway = withSpan("intelligence.model.route", {
      "app.prompt_version": prompt.version,
      "app.model": prompt.model,
      "app.provider": prompt.provider,
    }, () => routeSupportModel(prompt));
    const retrieval = withSpan("intelligence.retrieval.run", {
      "app.ticket_id": ticket.id,
      "app.knowledge_source_count": knowledgeSources.length,
    }, (retrievalSpan) => {
      const retrievalResult = retrieveSourcesForTicket({ ticket, knowledgeSources });
      retrievalSpan.setAttribute("app.retrieved_source_count", retrievalResult.sources.length);
      retrievalSpan.setAttribute(
        "app.retrieved_source_ids",
        retrievalResult.sources.map((source) => source.id).join(","),
      );
      return retrievalResult;
    });
    const output = withSpan("intelligence.model.generate", {
      "app.ticket_id": ticket.id,
      "app.model": gateway.model,
      "app.provider": gateway.provider,
    }, () => generateSupportOutput({ ticket, sources: retrieval.sources }));
    const validation = withSpan("intelligence.validation.run", {
      "app.ticket_id": ticket.id,
      "app.source_count": retrieval.sources.length,
    }, (validationSpan) => {
      const validationResult = validateSupportOutput({ ticket, output, sources: retrieval.sources });
      validationSpan.setAttribute("app.validation_status", validationResult.status);
      return validationResult;
    });
    const traceSteps = buildTraceSteps({
      ticket,
      promptVersion: prompt.version,
      renderedPrompt: prompt.renderedUser,
      retrievalTrace: retrieval.trace,
      gatewayModel: gateway.model,
      fallbackModel: gateway.fallbackModel,
      validationTrace: validation.trace,
    });

    span.setAttribute("app.prompt_version", prompt.version);
    span.setAttribute("app.model", gateway.model);
    span.setAttribute("app.provider", gateway.provider);
    span.setAttribute("app.validation_status", validation.status);
    span.setAttribute("app.approval_required", output.approvalRequired || validation.status !== "Pass");

    const result = copilotRunResultSchema.parse({
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

    const observation = recordSupportRunObservation({
      ticket,
      mode,
      result,
      sources: retrieval.sources,
    });
    span.setAttribute("app.ai_observation_id", observation.id);
    span.setAttribute("app.ai_observation_sink", observation.metadata.sink);

    return result;
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
