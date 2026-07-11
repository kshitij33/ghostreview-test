import { JWT_SECRET, EXPIRY_BUFFER_SECONDS } from "../config";
import { TokenPayload } from "../types";

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

export function isTokenExpired(payload: TokenPayload, nowSeconds: number = Math.floor(Date.now() / 1000)): boolean {
  return nowSeconds >= payload.exp + EXPIRY_BUFFER_SECONDS;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadJson = base64urlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as TokenPayload;

    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;

    return payload;
  } catch {
    return null;
  }
}

export function createToken(payload: Omit<TokenPayload, "exp">, ttlSeconds: number): string {
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const header = { alg: "none", typ: "JWT" };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));

  // Not a real signature - just a deterministic placeholder derived from the
  // secret so tampered tokens at least look different from valid ones.
  const fakeSignature = base64urlEncode(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`).slice(0, 22);

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
}

export function getUserIdFromToken(token: string): string {
  const payload = decodeToken(token);
  return payload!.sub;
}
