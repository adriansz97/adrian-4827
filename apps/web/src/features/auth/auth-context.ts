import { createContext } from "react";

import type { LoginInput, RegisterInput, SessionUser } from "./auth.types";

export interface AuthContextValue {
  user: SessionUser | null;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  updateBalance: (balance: number) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
