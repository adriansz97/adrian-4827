import {
  snailPayResponseSchema,
  type SnailPayChargeRequest,
  type SnailPayResponse,
} from "@snail-gp/contracts";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const REQUEST_TIMEOUT_MS = 3_500;

export class SnailPayRequestError extends Error {
  readonly reason: "transaction" | "system" | "timeout";
  readonly response: SnailPayResponse | null;

  constructor(
    message: string,
    reason: "transaction" | "system" | "timeout",
    response: SnailPayResponse | null = null,
  ) {
    super(message);
    this.name = "SnailPayRequestError";
    this.reason = reason;
    this.response = response;
  }
}

export async function createCharge(
  charge: SnailPayChargeRequest,
): Promise<SnailPayResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const httpResponse = await fetch(`${API_URL}/api/snailpay/charges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(charge),
      signal: controller.signal,
    });

    const payload: unknown = await httpResponse.json();
    const parsedResponse = snailPayResponseSchema.safeParse(payload);

    if (!parsedResponse.success) {
      throw new SnailPayRequestError(
        "SnailPay devolvió una respuesta inesperada.",
        "system",
      );
    }

    if (!httpResponse.ok || parsedResponse.data.status !== "approved") {
      const reason =
        parsedResponse.data.status === "rejected" ? "transaction" : "system";

      throw new SnailPayRequestError(
        getResponseMessage(parsedResponse.data.status_detail),
        reason,
        parsedResponse.data,
      );
    }

    return parsedResponse.data;
  } catch (error) {
    if (error instanceof SnailPayRequestError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new SnailPayRequestError(
        "SnailPay tardó demasiado en responder. No se aplicó ninguna recarga.",
        "timeout",
      );
    }

    throw new SnailPayRequestError(
      "No fue posible comunicarse con SnailPay. No se aplicó ninguna recarga.",
      "system",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

function getResponseMessage(statusDetail: string): string {
  const messages: Record<string, string> = {
    card_declined:
      "La tarjeta fue rechazada.",
    payment_data_mismatch:
      "Los datos no corresponden a un método de pago aprobado.",
    system_unavailable:
      "SnailPay no está disponible en este momento. No se aplicó la recarga.",
    processing_timeout:
      "SnailPay agotó el tiempo de procesamiento. No se aplicó la recarga.",
  };

  if (statusDetail.startsWith("invalid_request:")) {
    return statusDetail
      .replace("invalid_request:", "Revisa los datos:")
      .trim();
  }

  return messages[statusDetail] ?? "La operación no pudo completarse.";
}
