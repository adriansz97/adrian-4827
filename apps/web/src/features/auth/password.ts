import { compare, hash } from "bcryptjs";

const HASH_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return hash(password, HASH_ROUNDS);
}

export function verifyPassword(
  password: string,
  expectedHash: string,
): Promise<boolean> {
  return compare(password, expectedHash);
}
