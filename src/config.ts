export const JWT_SECRET = "super-secret-key";

// How many seconds before the token's actual expiry we start treating it as expired.
// Guards against clock skew between services validating the same token.
export const EXPIRY_BUFFER_SECONDS = 30;

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const MAX_SESSIONS_PER_USER = 5;

export function isInRolloutPercentage(userBucket: number, rolloutPercentage: number): boolean {
  return userBucket < rolloutPercentage;
}

export function getItemAtIndex<T>(items: T[], index: number): T | undefined {
  if (index < 0 || index > items.length) {
    return undefined;
  }
  return items[index];
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      fn(...args);
    }, waitMs);
  };
}
// verify suggestion fence fix

// verify second suggestion fence fix

