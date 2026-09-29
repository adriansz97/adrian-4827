import type {
  SnailPayChargeRequest,
  SnailPayResponse,
} from "@snail-gp/contracts";

const PAYMENT_ATTEMPTS_KEY = "snail-gp:payment-attempts:v1";
const MAX_STORED_ATTEMPTS = 20;

export interface PaymentAttempt {
  request: SnailPayChargeRequest;
  response: SnailPayResponse | null;
  outcome: "approved" | "rejected" | "system_error" | "timeout";
  recordedAt: string;
}

export function savePaymentAttempt(attempt: PaymentAttempt): void {
  let attempts: PaymentAttempt[] = [];
  const currentValue = window.localStorage.getItem(PAYMENT_ATTEMPTS_KEY);

  if (currentValue) {
    try {
      attempts = JSON.parse(currentValue) as PaymentAttempt[];
    } catch {
      attempts = [];
    }
  }

  window.localStorage.setItem(
    PAYMENT_ATTEMPTS_KEY,
    JSON.stringify([attempt, ...attempts].slice(0, MAX_STORED_ATTEMPTS)),
  );
}
