import { decodeToken, isTokenExpired } from "./token";
import { AuthResult } from "../types";

const BEARER_PREFIX = "Bearer ";

export function authenticateRequest(authorizationHeader: string | undefined): AuthResult {
  if (!authorizationHeader || !authorizationHeader.startsWith(BEARER_PREFIX)) {
    return { ok: false, reason: "missing_or_malformed_header" };
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();
  if (!token) {
    return { ok: false, reason: "missing_or_malformed_header" };
  }

  const payload = decodeToken(token);
  if (!payload) {
    return { ok: false, reason: "invalid_token" };
  }

  if (isTokenExpired(payload)) {
    return { ok: false, reason: "token_expired" };
  }

  return { ok: true, userId: payload.sub, role: payload.role };
}

export function requireAdmin(authResult: AuthResult): boolean {
  return authResult.ok && authResult.role === "admin";
}
