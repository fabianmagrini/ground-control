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
import { withSpan } from "../observability/tracing";

export const apiApp = new Hono<{ Variables: AuthVariables }>()
  .get("/health", (context) =>
    context.json({
      ok: true,
      service: "ground-control-api",
    }),
  )
  .use("*", requireIdentity)
  .get("/tickets", async (context) =>
    withSpan("api.get_tickets", getApiSpanAttributes(context.get("identity")), async (span) => {
      const identity = context.get("identity");
      assertPermission(identity, "tickets:read");
      const tickets = (await getTicketsRouteDataFromRepository(identity)).filter((ticket) =>
        canReadTicket(identity, ticket),
      );

      span.setAttribute("app.ticket_count", tickets.length);
      return context.json(ticketSchema.array().parse(tickets));
    }),
  )
  .get("/tickets/:ticketId", async (context) =>
    withSpan("api.get_ticket", {
      ...getApiSpanAttributes(context.get("identity")),
      "app.ticket_id": context.req.param("ticketId"),
    }, async () => {
      const identity = context.get("identity");
      assertPermission(identity, "tickets:read");
      const ticketId = context.req.param("ticketId");
      const ticket = await getTicketRouteDataFromRepository(ticketId, identity);

      if (!ticket) {
        throw new HTTPException(404, { message: `Ticket ${ticketId} not found.` });
      }

      if (!canReadTicket(identity, ticket)) {
        throw new HTTPException(403, { message: `Ticket ${ticketId} is not visible.` });
      }

      return context.json(ticketSchema.parse(ticket));
    }),
  )
  .get("/knowledge", async (context) =>
    withSpan("api.get_knowledge", getApiSpanAttributes(context.get("identity")), async (span) => {
      const identity = context.get("identity");
      assertPermission(identity, "knowledge:read");
      const sources = (await getKnowledgeRouteDataFromRepository(identity)).filter((source) =>
        canReadKnowledgeSource(identity, source),
      );

      span.setAttribute("app.knowledge_source_count", sources.length);
      return context.json(knowledgeSourceSchema.array().parse(sources));
    }),
  )
  .get("/review-workflow", async (context) =>
    withSpan("api.get_review_workflow", getApiSpanAttributes(context.get("identity")), async () => {
      const identity = context.get("identity");
      assertPermission(identity, "review-workflow:read");

      return context.json(
        reviewWorkflowRouteDataSchema.parse(
          await getReviewWorkflowRouteDataFromRepository(identity),
        ),
      );
    }),
  );

export type ApiApp = typeof apiApp;

function getApiSpanAttributes(identity: AuthVariables["identity"]) {
  return {
    "enduser.id": identity.subject,
    "enduser.role": identity.roles.join(","),
    "app.tenant": identity.tenantSlug,
  };
}
