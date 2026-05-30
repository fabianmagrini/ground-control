import type { Section } from "./types";

export const sectionConfig: Record<Section, { eyebrow: string; title: string; path: string }> = {
  support: {
    eyebrow: "Support Desk",
    title: "Enterprise Support Command Center",
    path: "/support",
  },
  approvals: {
    eyebrow: "Human Review",
    title: "Approval Queue",
    path: "/approvals",
  },
  knowledge: {
    eyebrow: "Knowledge Operations",
    title: "Sources, Freshness, and Access",
    path: "/knowledge",
  },
  observability: {
    eyebrow: "AI Operations",
    title: "Observability and Evaluation",
    path: "/observability",
  },
  governance: {
    eyebrow: "Governance",
    title: "Controls and Architecture",
    path: "/governance",
  },
};
