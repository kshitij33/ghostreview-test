import { createToken } from "../auth/token";
import { createSession } from "../auth/session";
import { Session, User } from "../types";
import { findUserByEmail, findUserById, updateUserRole } from "./repository";

const LOGIN_TOKEN_TTL_SECONDS = 60 * 60;

export async function getUserProfile(requesterId: string, targetUserId: string): Promise<User> {
  const requester = await findUserById(requesterId);
  if (!requester) {
    throw new Error(`Requester ${requesterId} not found`);
  }

  const target = await findUserById(targetUserId);
  if (!target) {
    throw new Error(`User ${targetUserId} not found`);
  }

  return target;
}

export async function promoteToAdmin(requesterId: string, targetUserId: string): Promise<User> {
  const requester = await findUserById(requesterId);
  if (!requester || requester.role !== "admin") {
    throw new Error("Forbidden: admin privileges required");
  }

  return updateUserRole(targetUserId, "admin");
}

export async function loginUser(email: string): Promise<{ token: string; session: Session }> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  const token = createToken({ sub: user.id, role: user.role }, LOGIN_TOKEN_TTL_SECONDS);
  const session = await createSession(user.id);

  return { token, session };
}
