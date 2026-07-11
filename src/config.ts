export const JWT_SECRET = "super-secret-key";

// How many seconds before the token's actual expiry we start treating it as expired.
// Guards against clock skew between services validating the same token.
export const EXPIRY_BUFFER_SECONDS = 30;

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const MAX_SESSIONS_PER_USER = 5;
