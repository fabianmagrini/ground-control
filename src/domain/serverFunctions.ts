import { createServerFn } from "@tanstack/react-start";
import {
  approvalSchema,
  auditEventSchema,
  evalCaseSchema,
  knowledgeSourceSchema,
  reviewWorkflowRouteDataSchema,
  ticketSchema,
} from "../../packages/contracts/src";
import {
  evals,
  initialApprovals,
  initialAuditEvents,
  initialTickets,
  knowledgeBase,
} from "./fixtures";

export const getTicketsRouteData = createServerFn({ method: "GET" }).handler(async () =>
  ticketSchema.array().parse(structuredClone(initialTickets)),
);

export const getKnowledgeRouteData = createServerFn({ method: "GET" }).handler(async () =>
  knowledgeSourceSchema.array().parse(structuredClone(knowledgeBase)),
);

export const getReviewWorkflowRouteData = createServerFn({ method: "GET" }).handler(async () =>
  reviewWorkflowRouteDataSchema.parse({
    approvals: approvalSchema.array().parse(structuredClone(initialApprovals)),
    auditEvents: auditEventSchema.array().parse(structuredClone(initialAuditEvents)),
    evals: evalCaseSchema.array().parse(structuredClone(evals)),
  }),
);
