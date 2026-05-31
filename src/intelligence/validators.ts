import type { RetrievedSource, Ticket, TraceStep } from "../domain/types";
import type { SupportCopilotStructuredOutput } from "./structuredOutput";

export type OutputValidationResult = {
  status: "Pass" | "Needs review" | "Blocked";
  trace: TraceStep;
};

const sensitivePatterns = [
  /password/i,
  /api[_ -]?key/i,
  /token/i,
  /credit card/i,
  /\b\d{13,19}\b/,
];

const unsupportedCommitmentPatterns = [
  /guarantee/i,
  /will resolve today/i,
  /refund has been processed/i,
  /engineering will fix/i,
];

export function validateSupportOutput({
  ticket,
  output,
  sources,
}: {
  ticket: Ticket;
  output: SupportCopilotStructuredOutput;
  sources: RetrievedSource[];
}): OutputValidationResult {
  const findings = [
    validateCitations(output, sources),
    validateSensitiveData(output.draft),
    validateUnsupportedCommitments(output.draft),
  ].filter(Boolean);

  const needsHumanApproval = output.approvalRequired || ticket.risk === "High";

  if (findings.some((finding) => finding?.severity === "block")) {
    return {
      status: "Blocked",
      trace: {
        title: "Guardrail validation",
        body: `Blocked output: ${findings.map((finding) => finding?.message).join("; ")}.`,
      },
    };
  }

  return {
    status: needsHumanApproval || findings.length > 0 ? "Needs review" : "Pass",
    trace: {
      title: "Guardrail validation",
      body: [
        "Checked source citations, sensitive data, unsupported commitments, structured output schema, and approval requirements.",
        findings.length > 0
          ? `Findings: ${findings.map((finding) => finding?.message).join("; ")}.`
          : "No validator findings.",
        needsHumanApproval ? "Human approval required before customer-visible action." : "No extra approval required.",
      ].join(" "),
    },
  };
}

function validateCitations(output: SupportCopilotStructuredOutput, sources: RetrievedSource[]) {
  const missing = sources
    .map((source) => source.id)
    .filter((sourceId) => !output.draft.includes(`[${sourceId}]`));

  if (missing.length === 0) return undefined;

  return {
    severity: "review",
    message: `missing citations ${missing.join(", ")}`,
  } as const;
}

function validateSensitiveData(draft: string) {
  if (!sensitivePatterns.some((pattern) => pattern.test(draft))) return undefined;

  return {
    severity: "block",
    message: "potential sensitive data exposure",
  } as const;
}

function validateUnsupportedCommitments(draft: string) {
  if (!unsupportedCommitmentPatterns.some((pattern) => pattern.test(draft))) return undefined;

  return {
    severity: "review",
    message: "potential unsupported commitment",
  } as const;
}
