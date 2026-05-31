import {
  authIdentitySchema,
  oidcClaimsSchema,
  type AuthIdentity,
  type UserRole,
} from "../../packages/contracts/src";
import type { KnowledgeSource, Ticket } from "../domain/types";

export type Permission =
  | "tickets:read"
  | "knowledge:read"
  | "review-workflow:read"
  | "approvals:review"
  | "workflow:escalate";

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "tickets:read",
    "knowledge:read",
    "review-workflow:read",
    "approvals:review",
    "workflow:escalate",
  ],
  support_manager: [
    "tickets:read",
    "knowledge:read",
    "review-workflow:read",
    "approvals:review",
    "workflow:escalate",
  ],
  support_agent: ["tickets:read", "knowledge:read", "workflow:escalate"],
  billing_ops: ["tickets:read", "knowledge:read", "review-workflow:read"],
  engineering: ["tickets:read", "knowledge:read"],
  trust: ["knowledge:read", "review-workflow:read", "approvals:review"],
};

export const localDevelopmentIdentity = authIdentitySchema.parse({
  subject: "local-dev",
  email: "fabian@example.com",
  name: "Fabian",
  tenantSlug: "ground-control-demo",
  roles: ["admin"],
  allowedRegions: ["APAC", "US", "US Gov", "EMEA", "global"],
  entitlements: [
    "All support",
    "Enterprise support",
    "Billing operations",
    "Platform support",
  ],
});

export function identityFromOidcClaims(claims: unknown): AuthIdentity {
  const parsedClaims = oidcClaimsSchema.parse(claims);

  return authIdentitySchema.parse({
    subject: parsedClaims.sub,
    email: parsedClaims.email,
    name: parsedClaims.name,
    tenantSlug: parsedClaims.tenant,
    roles: parsedClaims.roles,
    allowedRegions: parsedClaims.regions,
    entitlements: parsedClaims.entitlements,
  });
}

export function hasPermission(identity: AuthIdentity, permission: Permission) {
  return identity.roles.some((role) => rolePermissions[role].includes(permission));
}

export function assertPermission(identity: AuthIdentity, permission: Permission) {
  if (!hasPermission(identity, permission)) {
    throw new AuthorizationError(`Missing permission ${permission}.`);
  }
}

export function canReadTicket(identity: AuthIdentity, ticket: Ticket) {
  return (
    hasPermission(identity, "tickets:read") &&
    (identity.allowedRegions.length === 0 || identity.allowedRegions.includes(ticket.region))
  );
}

export function canReadKnowledgeSource(identity: AuthIdentity, source: KnowledgeSource) {
  return (
    hasPermission(identity, "knowledge:read") &&
    (source.access === "All support" || identity.entitlements.includes(source.access))
  );
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
