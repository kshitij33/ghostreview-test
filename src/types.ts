export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface TokenPayload {
  sub: string;
  exp: number;
  role: "admin" | "user";
}

export interface AuthResult {
  ok: boolean;
  userId?: string;
  role?: string;
  reason?: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
