import { queryOptions } from "@tanstack/react-query";
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
  queryFn: async () => structuredClone(initialTickets),
  initialData: () => structuredClone(initialTickets),
});

export const knowledgeRouteDataQueryOptions = queryOptions({
  queryKey: routeDataKeys.knowledge,
  queryFn: async () => structuredClone(knowledgeBase),
  initialData: () => structuredClone(knowledgeBase),
});

export const reviewWorkflowRouteDataQueryOptions = queryOptions({
  queryKey: routeDataKeys.reviewWorkflow,
  queryFn: async () => ({
    approvals: structuredClone(initialApprovals),
    auditEvents: structuredClone(initialAuditEvents),
    evals: structuredClone(evals),
  }),
  initialData: () => ({
    approvals: structuredClone(initialApprovals),
    auditEvents: structuredClone(initialAuditEvents),
    evals: structuredClone(evals),
  }),
});
