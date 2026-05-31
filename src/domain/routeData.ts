import { queryOptions } from "@tanstack/react-query";
import {
  approvalSchema,
  auditEventSchema,
  evalCaseSchema,
  knowledgeSourceSchema,
  reviewWorkflowRouteDataSchema,
  ticketSchema,
} from "../../packages/contracts/src";
import {
  getKnowledgeRouteData,
  getReviewWorkflowRouteData,
  getTicketsRouteData,
} from "./serverFunctions";
import {
  evals,
  initialApprovals,
  initialAuditEvents,
  initialTickets,
  knowledgeBase,
} from "./fixtures";

export const routeDataKeys = {
  tickets: ["route-data", "tickets"] as const,
  knowledge: ["route-data", "knowledge"] as const,
  reviewWorkflow: ["route-data", "review-workflow"] as const,
};

export const ticketsRouteDataQueryOptions = queryOptions({
  queryKey: routeDataKeys.tickets,
  queryFn: () => getTicketsRouteData(),
  initialData: () => ticketSchema.array().parse(structuredClone(initialTickets)),
});

export const knowledgeRouteDataQueryOptions = queryOptions({
  queryKey: routeDataKeys.knowledge,
  queryFn: () => getKnowledgeRouteData(),
  initialData: () => knowledgeSourceSchema.array().parse(structuredClone(knowledgeBase)),
});

export const reviewWorkflowRouteDataQueryOptions = queryOptions({
  queryKey: routeDataKeys.reviewWorkflow,
  queryFn: () => getReviewWorkflowRouteData(),
  initialData: getInitialReviewWorkflowRouteData,
});

function getInitialReviewWorkflowRouteData() {
  return reviewWorkflowRouteDataSchema.parse({
    approvals: approvalSchema.array().parse(structuredClone(initialApprovals)),
    auditEvents: auditEventSchema.array().parse(structuredClone(initialAuditEvents)),
    evals: evalCaseSchema.array().parse(structuredClone(evals)),
  });
}
