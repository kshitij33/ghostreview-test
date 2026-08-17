import { randomUUID } from "crypto";
import { db } from "../db";
import { User } from "../types";

export async function findUserById(id: string): Promise<User | null> {
  return db.users.findById(id);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return db.users.findByEmail(email);
}

export async function createUser(email: string, role: "admin" | "user" = "user"): Promise<User> {
  const existing = await db.users.findByEmail(email);
  if (existing) {
    throw new Error(`User with email ${email} already exists`);
  }

  const user: User = {
    id: randomUUID(),
    email: email.toLowerCase(),
    role,
    createdAt: new Date(),
  };

  return db.users.insert(user);
}

export async function updateUserRole(id: string, role: "admin" | "user"): Promise<User> {
  const updated = await db.users.update(id, { role });
  if (!updated) {
    throw new Error(`User ${id} not found`);
  }
  return updated;
}
