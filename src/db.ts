import { Session, User } from "./types";

/**
 * Stand-in for a real database client (e.g. a Prisma or Knex instance).
 * Backed by in-memory maps so the rest of the codebase can be exercised
 * end-to-end without a real database being wired up.
 */
class InMemoryDb {
  private users = new Map<string, User>();
  private sessions = new Map<string, Session>();

  users_findById = async (id: string): Promise<User | null> => {
    return this.users.get(id) ?? null;
  };

  users_findByEmail = async (email: string): Promise<User | null> => {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  };

  users_insert = async (user: User): Promise<User> => {
    this.users.set(user.id, user);
    return user;
  };

  users_update = async (id: string, data: Partial<User>): Promise<User | null> => {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data };
    this.users.set(id, updated);
    return updated;
  };

  sessions_findById = async (id: string): Promise<Session | null> => {
    return this.sessions.get(id) ?? null;
  };

  sessions_findByUserId = async (userId: string): Promise<Session[]> => {
    return Array.from(this.sessions.values()).filter((s) => s.userId === userId);
  };

  sessions_insert = async (session: Session): Promise<Session> => {
    this.sessions.set(session.id, session);
    return session;
  };

  sessions_delete = async (id: string): Promise<void> => {
    this.sessions.delete(id);
  };

  sessions_deleteByUserId = async (userId: string): Promise<void> => {
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId) this.sessions.delete(id);
    }
  };
}

const instance = new InMemoryDb();

export const db = {
  users: {
    findById: instance.users_findById,
    findByEmail: instance.users_findByEmail,
    insert: instance.users_insert,
    update: instance.users_update,
  },
  sessions: {
    findById: instance.sessions_findById,
    findByUserId: instance.sessions_findByUserId,
    insert: instance.sessions_insert,
    delete: instance.sessions_delete,
    deleteByUserId: instance.sessions_deleteByUserId,
  },
};
