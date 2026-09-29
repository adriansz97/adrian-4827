import { randomUUID } from "node:crypto";
import { Router } from "express";

import {
  snailPayChargeSchema,
  type SnailPayChargeRequest,
  type SnailPayResponse,
} from "@snail-gp/contracts";

import {
  APPROVED_CVV,
  APPROVED_EXPIRATION_DATE,
  SNAILPAY_CARDS,
} from "./snailpay.constants.js";

const router = Router();

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function getAttemptedValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getAttemptedAmount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function createResponse(
  request: Partial<SnailPayChargeRequest>,
  result: Pick<SnailPayResponse, "status" | "status_detail"> & {
    authorization_code?: string | null;
  },
): SnailPayResponse {
  const id = randomUUID();

  return {
    id,
    status: result.status,
    status_detail: result.status_detail,
    transaction_amount: getAttemptedAmount(request.transaction_amount),
    date_created: new Date().toISOString(),
    authorization_code: result.authorization_code ?? null,
    reference: `SNP-${id.slice(0, 8).toUpperCase()}`,
    payer_id: getAttemptedValue(request.payer_id),
    payer_email: getAttemptedValue(request.payer_email),
    card_number: getAttemptedValue(request.card_number),
    cvv: getAttemptedValue(request.cvv),
  };
}

router.post("/charges", async (request, response) => {
  const parsedRequest = snailPayChargeSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    const firstIssue = parsedRequest.error.issues[0];

    response.status(400).json(
      createResponse(request.body ?? {}, {
        status: "rejected",
        status_detail: `invalid_request: ${
          firstIssue?.message ?? "Datos inválidos."
        }`,
      }),
    );

    return;
  }

  const charge = parsedRequest.data;

  if (charge.card_number === SNAILPAY_CARDS.systemError) {
    response.status(503).json(
      createResponse(charge, {
        status: "error",
        status_detail: "system_unavailable",
      }),
    );

    return;
  }

  if (charge.card_number === SNAILPAY_CARDS.timeout) {
    const delay = Number(process.env.SNAILPAY_TIMEOUT_DELAY_MS ?? 5_500);

    await wait(delay);

    response.status(504).json(
      createResponse(charge, {
        status: "error",
        status_detail: "processing_timeout",
      }),
    );

    return;
  }

  if (charge.card_number === SNAILPAY_CARDS.declined) {
    response.status(422).json(
      createResponse(charge, {
        status: "rejected",
        status_detail: "card_declined",
      }),
    );

    return;
  }

  const isApproved =
    charge.card_number === SNAILPAY_CARDS.approved &&
    charge.expiration_date === APPROVED_EXPIRATION_DATE &&
    charge.cvv === APPROVED_CVV;

  if (!isApproved) {
    response.status(422).json(
      createResponse(charge, {
        status: "rejected",
        status_detail: "payment_data_mismatch",
      }),
    );

    return;
  }

  response.status(201).json(
    createResponse(charge, {
      status: "approved",
      status_detail: "accredited",
      authorization_code: randomUUID().slice(0, 8).toUpperCase(),
    }),
  );
});

export { router as snailPayRouter };
