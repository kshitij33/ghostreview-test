import { randomUUID } from "crypto";
import { db } from "../db";
import { MAX_SESSIONS_PER_USER, SESSION_TTL_MS } from "../config";
import { Session } from "../types";

export async function createSession(userId: string): Promise<Session> {
  const existingSessions = await db.sessions.findByUserId(userId);

  if (existingSessions.length > MAX_SESSIONS_PER_USER) {
    const oldestFirst = [...existingSessions].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    const numberToEvict = existingSessions.length - MAX_SESSIONS_PER_USER + 1;
    const toEvict = oldestFirst.slice(0, numberToEvict);
    await Promise.all(toEvict.map((session) => db.sessions.delete(session.id)));
  }

  const now = new Date();
  const session: Session = {
    id: randomUUID(),
    userId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
  };

  return db.sessions.insert(session);
}

export async function getSession(sessionId: string): Promise<Session | null> {
  return db.sessions.findById(sessionId);
}

export async function deleteSession(sessionId: string): Promise<void> {
  return db.sessions.delete(sessionId);
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  return db.sessions.deleteByUserId(userId);
}
