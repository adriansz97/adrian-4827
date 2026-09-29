import type {
  SnailPayChargeRequest,
  SnailPayResponse,
} from "@snail-gp/contracts";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createCharge } from "./snailpay-api";

const charge: SnailPayChargeRequest = {
  card_number: "4000000000000002",
  expiration_date: "12/26",
  cvv: "543",
  full_name: "Adrian Test",
  transaction_amount: 250,
  payer_id: "550e8400-e29b-41d4-a716-446655440000",
  payer_email: "adrian@example.com",
};

const rejectedResponse: SnailPayResponse = {
  id: "payment-id",
  status: "rejected",
  status_detail: "card_declined",
  transaction_amount: 250,
  date_created: new Date().toISOString(),
  authorization_code: null,
  reference: "SNP-DEMO1234",
  payer_id: charge.payer_id,
  payer_email: charge.payer_email,
  card_number: charge.card_number,
  cvv: charge.cvv,
};

describe("SnailPay client", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("turns a rejected response into a comprehensible transaction error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(rejectedResponse), {
          status: 422,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ),
    );

    await expect(createCharge(charge)).rejects.toMatchObject({
      reason: "transaction",
      message: "La tarjeta fue rechazada.",
      response: rejectedResponse,
    });
  });

  it("aborts a slow request and reports that no top-up was applied", async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      "fetch",
      vi.fn((_url, options: RequestInit | undefined) => {
        return new Promise((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          });
        });
      }),
    );

    const assertion = expect(
      createCharge(charge),
    ).rejects.toMatchObject({
      reason: "timeout",
      message:
        "SnailPay tardó demasiado en responder. No se aplicó ninguna recarga.",
    });

    await vi.advanceTimersByTimeAsync(3_500);
    await assertion;
  });
});
