import { useMemo, useState, type PropsWithChildren } from "react";

import { AuthContext } from "./auth-context";
import { hashPassword, verifyPassword } from "./password";
import {
  clearStoredSession,
  readStoredSession,
  readStoredUser,
  saveStoredSession,
  saveStoredUser,
} from "./auth.storage";
import type {
  LoginInput,
  RegisterInput,
  SessionUser,
  StoredUser,
} from "./auth.types";

function toSessionUser(user: StoredUser): SessionUser {
  const { id, fullName, email, balance, createdAt } = user;

  return {
    id,
    fullName,
    email,
    balance,
    createdAt,
  };
}

function restoreSession(): SessionUser | null {
  const session = readStoredSession();
  const user = readStoredUser();

  if (!session || !user || session.userId !== user.id) {
    clearStoredSession();
    return null;
  }

  return toSessionUser(user);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(restoreSession);

  const value = useMemo(
    () => ({
      user,

      async register(input: RegisterInput) {
        const existingUser = readStoredUser();

        if (existingUser) {
          throw new Error(
            "Ya existe una cuenta en este navegador. Inicia sesión para continuar.",
          );
        }

        const passwordHash = await hashPassword(input.password);

        const storedUser: StoredUser = {
          id: window.crypto.randomUUID(),
          fullName: input.fullName.trim(),
          email: input.email.trim().toLowerCase(),
          passwordHash,
          balance: 0,
          createdAt: new Date().toISOString(),
        };

        saveStoredUser(storedUser);
        saveStoredSession({
          userId: storedUser.id,
          startedAt: new Date().toISOString(),
        });

        setUser(toSessionUser(storedUser));
      },

      async login(input: LoginInput) {
        const storedUser = readStoredUser();
        const email = input.email.trim().toLowerCase();

        if (!storedUser || storedUser.email !== email) {
          throw new Error("El correo o la contraseña no coinciden.");
        }

        const isValidPassword = await verifyPassword(
          input.password,
          storedUser.passwordHash,
        );

        if (!isValidPassword) {
          throw new Error("El correo o la contraseña no coinciden.");
        }

        saveStoredSession({
          userId: storedUser.id,
          startedAt: new Date().toISOString(),
        });

        setUser(toSessionUser(storedUser));
      },

      logout() {
        clearStoredSession();
        setUser(null);
      },

      updateBalance(balance: number) {
        const storedUser = readStoredUser();

        if (!storedUser || !user || storedUser.id !== user.id) return;

        const updatedUser = {
          ...storedUser,
          balance,
        };

        saveStoredUser(updatedUser);
        setUser(toSessionUser(updatedUser));
      },
    }),
    [user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
