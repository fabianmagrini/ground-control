import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireIdentity, type AuthVariables } from "../auth/middleware";
import {
  assertPermission,
  canReadKnowledgeSource,
  canReadTicket,
} from "../auth/policy";
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

export const apiApp = new Hono<{ Variables: AuthVariables }>()
  .get("/health", (context) =>
    context.json({
      ok: true,
      service: "ground-control-api",
    }),
  )
  .use("*", requireIdentity)
  .get("/tickets", async (context) => {
    const identity = context.get("identity");
    assertPermission(identity, "tickets:read");
    const tickets = (await getTicketsRouteDataFromRepository()).filter((ticket) =>
      canReadTicket(identity, ticket),
    );

    return context.json(ticketSchema.array().parse(tickets));
  })
  .get("/tickets/:ticketId", async (context) => {
    const identity = context.get("identity");
    assertPermission(identity, "tickets:read");
    const ticketId = context.req.param("ticketId");
    const ticket = await getTicketRouteDataFromRepository(ticketId);

    if (!ticket) {
      throw new HTTPException(404, { message: `Ticket ${ticketId} not found.` });
    }

    if (!canReadTicket(identity, ticket)) {
      throw new HTTPException(403, { message: `Ticket ${ticketId} is not visible.` });
    }

    return context.json(ticketSchema.parse(ticket));
  })
  .get("/knowledge", async (context) => {
    const identity = context.get("identity");
    assertPermission(identity, "knowledge:read");
    const sources = (await getKnowledgeRouteDataFromRepository()).filter((source) =>
      canReadKnowledgeSource(identity, source),
    );

    return context.json(knowledgeSourceSchema.array().parse(sources));
  })
  .get("/review-workflow", async (context) => {
    const identity = context.get("identity");
    assertPermission(identity, "review-workflow:read");

    return context.json(
      reviewWorkflowRouteDataSchema.parse(await getReviewWorkflowRouteDataFromRepository()),
    );
  });

export type ApiApp = typeof apiApp;
