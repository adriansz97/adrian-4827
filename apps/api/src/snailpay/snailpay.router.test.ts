import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";

import { createApp } from "../app.js";
import { SNAILPAY_CARDS } from "./snailpay.constants.js";

const baseCharge = {
  expiration_date: "12/26",
  cvv: "543",
  full_name: "Adrian Test",
  transaction_amount: 250,
  payer_id: "550e8400-e29b-41d4-a716-446655440000",
  payer_email: "adrian@example.com",
};

describe("POST /api/snailpay/charges", () => {
  afterEach(() => {
    delete process.env.SNAILPAY_TIMEOUT_DELAY_MS;
  });

  it("approves the documented payment data", async () => {
    const response = await request(createApp())
      .post("/api/snailpay/charges")
      .send({
        ...baseCharge,
        card_number: SNAILPAY_CARDS.approved,
      });

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "approved",
        status_detail: "accredited",
        transaction_amount: 250,
        payer_id: baseCharge.payer_id,
        payer_email: baseCharge.payer_email,
        card_number: SNAILPAY_CARDS.approved,
        cvv: baseCharge.cvv,
      }),
    );

    expect(response.body.authorization_code).toMatch(/^[A-F0-9]{8}$/);
    expect(response.body.reference).toMatch(/^SNP-/);
  });

  it("returns a transaction rejection without an authorization code", async () => {
    const response = await request(createApp())
      .post("/api/snailpay/charges")
      .send({
        ...baseCharge,
        card_number: SNAILPAY_CARDS.declined,
      });

    expect(response.status).toBe(422);
    expect(response.body.status).toBe("rejected");
    expect(response.body.status_detail).toBe("card_declined");
    expect(response.body.authorization_code).toBeNull();
  });

  it("returns the complete contract for a simulated system error", async () => {
    const response = await request(createApp())
      .post("/api/snailpay/charges")
      .send({
        ...baseCharge,
        card_number: SNAILPAY_CARDS.systemError,
      });

    expect(response.status).toBe(503);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        status_detail: "system_unavailable",
        transaction_amount: 250,
        card_number: SNAILPAY_CARDS.systemError,
        cvv: "543",
      }),
    );
  });

  it("simulates a timeout without approving the operation", async () => {
    process.env.SNAILPAY_TIMEOUT_DELAY_MS = "5";

    const response = await request(createApp())
      .post("/api/snailpay/charges")
      .send({
        ...baseCharge,
        card_number: SNAILPAY_CARDS.timeout,
      });

    expect(response.status).toBe(504);
    expect(response.body.status).toBe("error");
    expect(response.body.status_detail).toBe("processing_timeout");
    expect(response.body.authorization_code).toBeNull();
  });

  it("explains invalid input and echoes the attempted fictitious data", async () => {
    const response = await request(createApp())
      .post("/api/snailpay/charges")
      .send({
        ...baseCharge,
        card_number: "1",
        transaction_amount: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("rejected");
    expect(response.body.status_detail).toContain("invalid_request");
    expect(response.body.card_number).toBe("1");
    expect(response.body.cvv).toBe("543");
  });
});
