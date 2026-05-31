import type { Ticket } from "../domain/types";

export type PromptDefinition = {
  key: string;
  version: string;
  status: "draft" | "active" | "retired";
  model: string;
  provider: string;
  system: string;
  template: string;
};

export const supportCopilotPrompt: PromptDefinition = {
  key: "support-copilot",
  version: "2026-05-31.demo",
  status: "active",
  model: "general-low-latency",
  provider: "prototype",
  system:
    "Summarize the support case, retrieve approved sources, draft a grounded customer reply, and require human approval for customer-visible actions.",
  template:
    "Ticket {{ticketId}} for {{customer}}. Mode {{mode}}. Respect account contract {{contract}} and data residency {{dataResidency}}.",
};

export function getActiveSupportPrompt() {
  return supportCopilotPrompt;
}

export function renderSupportPrompt({
  ticket,
  mode,
}: {
  ticket: Ticket;
  mode: "summarize" | "retrieve" | "draft" | "validate" | "full";
}) {
  const prompt = getActiveSupportPrompt();

  return {
    ...prompt,
    renderedUser: prompt.template
      .replace("{{ticketId}}", ticket.id)
      .replace("{{customer}}", ticket.customer)
      .replace("{{mode}}", mode)
      .replace("{{contract}}", ticket.account.contract)
      .replace("{{dataResidency}}", ticket.account.dataResidency),
  };
}
