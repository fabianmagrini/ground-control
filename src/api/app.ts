import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  knowledgeSourceSchema,
  reviewWorkflowRouteDataSchema,
  ticketSchema,
} from "../../packages/contracts/src";
import {
  getKnowledgeRouteDataFromRepository,
  getReviewWorkflowRouteDataFromRepository,
  getTicketRouteDataFromRepository,
  getTicketsRouteDataFromRepository,
} from "../db/routeDataRepository";

export const apiApp = new Hono()
  .get("/health", (context) =>
    context.json({
      ok: true,
      service: "ground-control-api",
    }),
  )
  .get("/tickets", async (context) =>
    context.json(ticketSchema.array().parse(await getTicketsRouteDataFromRepository())),
  )
  .get("/tickets/:ticketId", async (context) => {
    const ticketId = context.req.param("ticketId");
    const ticket = await getTicketRouteDataFromRepository(ticketId);

    if (!ticket) {
      throw new HTTPException(404, { message: `Ticket ${ticketId} not found.` });
    }

    return context.json(ticketSchema.parse(ticket));
  })
  .get("/knowledge", async (context) =>
    context.json(knowledgeSourceSchema.array().parse(await getKnowledgeRouteDataFromRepository())),
  )
  .get("/review-workflow", async (context) =>
    context.json(
      reviewWorkflowRouteDataSchema.parse(await getReviewWorkflowRouteDataFromRepository()),
    ),
  );

export type ApiApp = typeof apiApp;
