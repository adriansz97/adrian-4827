export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  balance: number;
  createdAt: string;
}

export type SessionUser = Pick<
  StoredUser,
  "id" | "fullName" | "email" | "balance" | "createdAt"
>;

export interface StoredSession {
  userId: string;
  startedAt: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
