import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import {
  AuthorizationError,
  identityFromOidcClaims,
  localDevelopmentIdentity,
} from "./policy";

export type AuthVariables = {
  identity: typeof localDevelopmentIdentity;
};

export const requireIdentity = createMiddleware<{ Variables: AuthVariables }>(
  async (context, next) => {
    try {
      context.set("identity", resolveIdentity(context.req.raw.headers));
      await next();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw new HTTPException(403, { message: error.message });
      }

      throw new HTTPException(401, { message: "Authentication required." });
    }
  },
);

export function resolveIdentity(headers: Headers) {
  const encodedClaims = headers.get("x-ground-control-oidc-claims");

  if (encodedClaims) {
    return identityFromOidcClaims(JSON.parse(encodedClaims));
  }

  if (process.env.NODE_ENV !== "production") {
    return localDevelopmentIdentity;
  }

  throw new Error("OIDC identity claims are required in production.");
}
