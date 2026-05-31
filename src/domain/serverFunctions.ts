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
  getKnowledgeRouteDataFromRepository,
  getReviewWorkflowRouteDataFromRepository,
  getTicketsRouteDataFromRepository,
} from "../db/routeDataRepository";

export const getTicketsRouteData = createServerFn({ method: "GET" }).handler(async () =>
  ticketSchema.array().parse(await getTicketsRouteDataFromRepository()),
);

export const getKnowledgeRouteData = createServerFn({ method: "GET" }).handler(async () =>
  knowledgeSourceSchema.array().parse(await getKnowledgeRouteDataFromRepository()),
);

export const getReviewWorkflowRouteData = createServerFn({ method: "GET" }).handler(async () =>
  reviewWorkflowRouteDataSchema.parse(await getValidatedReviewWorkflowRouteData()),
);

async function getValidatedReviewWorkflowRouteData() {
  const data = await getReviewWorkflowRouteDataFromRepository();

  return {
    approvals: approvalSchema.array().parse(data.approvals),
    auditEvents: auditEventSchema.array().parse(data.auditEvents),
    evals: evalCaseSchema.array().parse(data.evals),
  };
}
