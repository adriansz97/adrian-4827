import type { StoredSession, StoredUser } from "./auth.types";

const USER_KEY = "snail-gp:user:v1";
const SESSION_KEY = "snail-gp:session:v1";

function readJson<T>(key: string): T | null {
  const value = window.localStorage.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function readStoredUser(): StoredUser | null {
  return readJson<StoredUser>(USER_KEY);
}

export function saveStoredUser(user: StoredUser): void {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function readStoredSession(): StoredSession | null {
  return readJson<StoredSession>(SESSION_KEY);
}

export function saveStoredSession(session: StoredSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
