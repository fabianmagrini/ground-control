import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
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
} from "../domain/fixtures";

export const apiApp = new Hono()
  .get("/health", (context) =>
    context.json({
      ok: true,
      service: "ground-control-api",
    }),
  )
  .get("/tickets", (context) =>
    context.json(ticketSchema.array().parse(structuredClone(initialTickets))),
  )
  .get("/tickets/:ticketId", (context) => {
    const ticketId = context.req.param("ticketId");
    const ticket = initialTickets.find((item) => item.id === ticketId);

    if (!ticket) {
      throw new HTTPException(404, { message: `Ticket ${ticketId} not found.` });
    }

    return context.json(ticketSchema.parse(structuredClone(ticket)));
  })
  .get("/knowledge", (context) =>
    context.json(knowledgeSourceSchema.array().parse(structuredClone(knowledgeBase))),
  )
  .get("/review-workflow", (context) =>
    context.json(
      reviewWorkflowRouteDataSchema.parse({
        approvals: structuredClone(initialApprovals),
        auditEvents: structuredClone(initialAuditEvents),
        evals: structuredClone(evals),
      }),
    ),
  );

export type ApiApp = typeof apiApp;
