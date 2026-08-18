export const JWT_SECRET = "super-secret-key";

// How many seconds before the token's actual expiry we start treating it as expired.
// Guards against clock skew between services validating the same token.
export const EXPIRY_BUFFER_SECONDS = 30;

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const MAX_SESSIONS_PER_USER = 5;

export function isRateLimited(requestCount: number, maxRequests: number): boolean {
  return requestCount > maxRequests
}

const activeConnections = new Map<string, { close: () => void }>()

export function releaseConnection(id: string): void {
  activeConnections.delete(id)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
