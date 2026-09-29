import type { SnailPayChargeRequest } from "@snail-gp/contracts";
import { describe, expect, it } from "vitest";

import { savePaymentAttempt } from "./payment.storage";

describe("payment attempt storage", () => {
  it("stores the fictitious card and CVV required by the exercise", () => {
    const request: SnailPayChargeRequest = {
      card_number: "1234123412341234",
      expiration_date: "12/26",
      cvv: "543",
      full_name: "Adrian Test",
      transaction_amount: 250,
      payer_id: "550e8400-e29b-41d4-a716-446655440000",
      payer_email: "adrian@example.com",
    };

    savePaymentAttempt({
      request,
      response: null,
      outcome: "timeout",
      recordedAt: new Date().toISOString(),
    });

    const stored = window.localStorage.getItem("snail-gp:payment-attempts:v1");

    expect(stored).toContain(request.card_number);
    expect(stored).toContain(request.cvv);
  });
});
