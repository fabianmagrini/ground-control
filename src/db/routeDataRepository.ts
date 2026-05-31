import "@tanstack/react-start/server-only";

import { eq } from "drizzle-orm";
import {
  evals,
  initialApprovals,
  initialAuditEvents,
  initialTickets,
  knowledgeBase,
} from "../domain/fixtures";
import type {
  Approval,
  AuditEvent,
  EvalCase,
  KnowledgeSource,
  ReviewWorkflowRouteData,
  Ticket,
} from "../domain/types";
import { db } from "./client";
import {
  accounts,
  approvals,
  auditEvents,
  evals as evalRows,
  knowledgeSources,
  messages,
  tickets,
  users,
} from "./schema";

export function isDatabaseRouteDataEnabled() {
  return (
    process.env.GROUND_CONTROL_ROUTE_DATA_SOURCE === "database" ||
    process.env.GROUND_CONTROL_USE_DATABASE === "true"
  );
}

export async function getTicketsRouteDataFromRepository(): Promise<Ticket[]> {
  if (!isDatabaseRouteDataEnabled()) {
    return structuredClone(initialTickets);
  }

  return getTicketsFromDatabase();
}

export async function getTicketRouteDataFromRepository(ticketId: string): Promise<Ticket | undefined> {
  const allTickets = await getTicketsRouteDataFromRepository();
  return allTickets.find((ticket) => ticket.id === ticketId);
}

export async function getKnowledgeRouteDataFromRepository(): Promise<KnowledgeSource[]> {
  if (!isDatabaseRouteDataEnabled()) {
    return structuredClone(knowledgeBase);
  }

  const rows = await db.select().from(knowledgeSources);
  return rows.map((source): KnowledgeSource => ({
    id: source.externalId,
    title: source.title,
    topic: source.topic,
    freshness: source.freshness,
    access: source.accessPolicy,
    owner: source.ownerName,
    body: source.body,
  }));
}

export async function getReviewWorkflowRouteDataFromRepository(): Promise<ReviewWorkflowRouteData> {
  if (!isDatabaseRouteDataEnabled()) {
    return {
      approvals: structuredClone(initialApprovals),
      auditEvents: structuredClone(initialAuditEvents),
      evals: structuredClone(evals),
    };
  }

  const [approvalData, auditEventData, evalData] = await Promise.all([
    getApprovalsFromDatabase(),
    getAuditEventsFromDatabase(),
    getEvalsFromDatabase(),
  ]);

  return {
    approvals: approvalData,
    auditEvents: auditEventData,
    evals: evalData,
  };
}

async function getTicketsFromDatabase(): Promise<Ticket[]> {
  const [ticketRows, accountRows, userRows, messageRows] = await Promise.all([
    db.select().from(tickets),
    db.select().from(accounts),
    db.select().from(users),
    db.select().from(messages),
  ]);

  const accountsById = new Map(accountRows.map((account) => [account.id, account]));
  const usersById = new Map(userRows.map((user) => [user.id, user]));
  const messagesByTicketId = new Map<string, typeof messageRows>();

  for (const message of messageRows) {
    const ticketMessages = messagesByTicketId.get(message.ticketId) ?? [];
    ticketMessages.push(message);
    messagesByTicketId.set(message.ticketId, ticketMessages);
  }

  return ticketRows.map((ticket): Ticket => {
    const account = accountsById.get(ticket.accountId);
    const owner = ticket.ownerId ? usersById.get(ticket.ownerId) : undefined;
    const csm = account?.csmUserId ? usersById.get(account.csmUserId) : undefined;
    const ticketMessages = messagesByTicketId.get(ticket.id) ?? [];

    return {
      id: ticket.externalId,
      customer: account?.name ?? "Unknown account",
      title: ticket.title,
      priority: ticket.priority,
      plan: account?.plan ?? "Enterprise",
      sla: ticket.sla,
      status: ticket.status,
      owner: owner?.name ?? "Unassigned",
      arr: account?.arr ?? "$0",
      health: account?.health ?? 0,
      sentiment: ticket.sentiment,
      impact: ticket.impact,
      region: account?.region ?? "Unknown",
      risk: ticket.risk,
      keywords: ticket.keywords,
      account: {
        csm: csm?.name ?? "Unassigned",
        renewal: account?.renewal ?? "Unknown",
        incidents: account?.incidents ?? "Unknown",
        contract: account?.contract ?? "Unknown",
        dataResidency: account?.dataResidency ?? "Unknown",
      },
      messages: ticketMessages
        .sort((first, second) => first.sentAt.getTime() - second.sentAt.getTime())
        .map((message) => ({
          sender: message.senderName,
          role: message.role,
          time: formatTime(message.sentAt),
          text: message.body,
        })),
    };
  });
}

async function getApprovalsFromDatabase(): Promise<Approval[]> {
  const approvalRows = await db.select().from(approvals);

  return Promise.all(
    approvalRows.map(async (approval): Promise<Approval> => {
      const [ticket] = await db.select().from(tickets).where(eq(tickets.id, approval.ticketId));
      const [account] = ticket
        ? await db.select().from(accounts).where(eq(accounts.id, ticket.accountId))
        : [];

      return {
        id: approval.externalId ?? approval.id,
        ticketId: ticket?.externalId ?? approval.ticketId,
        customer: account?.name ?? "Unknown account",
        risk: approval.risk,
        reason: approval.reason,
        status: approval.status,
      };
    }),
  );
}

async function getAuditEventsFromDatabase(): Promise<AuditEvent[]> {
  const rows = await db.select().from(auditEvents);
  return rows.map((event): AuditEvent => ({
    time: formatTime(event.occurredAt),
    actor: event.actorName,
    event: event.event,
  }));
}

async function getEvalsFromDatabase(): Promise<EvalCase[]> {
  const rows = await db.select().from(evalRows);
  return rows.map((evalCase): EvalCase => ({
    name: evalCase.name,
    score: evalCase.score,
    threshold: evalCase.threshold,
    status: evalCase.status === "Failed" ? "Watch" : evalCase.status,
  }));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}
