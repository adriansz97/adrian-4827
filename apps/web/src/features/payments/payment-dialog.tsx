import { zodResolver } from "@hookform/resolvers/zod";
import type {
  SnailPayChargeRequest,
  SnailPayResponse,
} from "@snail-gp/contracts";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { SessionUser } from "@/features/auth/auth.types";

import { savePaymentAttempt, type PaymentAttempt } from "./payment.storage";
import { createCharge, SnailPayRequestError } from "./snailpay-api";

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Ingresa los 16 dígitos de la tarjeta."),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Usa el formato MM/AA."),
  cvv: z.string().regex(/^\d{3}$/, "Ingresa un CVV de 3 dígitos."),
  fullName: z.string().trim().min(1, "Ingresa el nombre completo."),
  amount: z
    .string()
    .trim()
    .refine((value) => Number(value) > 0, "El monto debe ser mayor que cero.")
    .refine(
      (value) => Number(value) <= 100_000,
      "El monto no puede superar $100,000.",
    ),
});

type PaymentForm = z.infer<typeof paymentSchema>;
type Scenario = "approved" | "declined" | "system" | "timeout";

const scenarioCards: Record<Scenario, string> = {
  approved: "1234123412341234",
  declined: "4000000000000002",
  system: "5000000000000000",
  timeout: "4080000000000000",
};

const scenarioLabels: Record<Scenario, string> = {
  approved: "Aprobado",
  declined: "Rechazado",
  system: "Sistema",
  timeout: "Timeout",
};

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SessionUser;
  onApproved: (newBalance: number) => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  user,
  onApproved,
}: PaymentDialogProps) {
  const [result, setResult] = useState<{
    kind: "success" | "error";
    message: string;
    response: SnailPayResponse | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      fullName: user.fullName,
      amount: "",
    },
  });

  function applyScenario(scenario: Scenario) {
    setResult(null);
    setValue("cardNumber", scenarioCards[scenario], {
      shouldValidate: true,
    });
    setValue("expirationDate", "12/26", {
      shouldValidate: true,
    });
    setValue("cvv", "543", {
      shouldValidate: true,
    });
    setValue("fullName", user.fullName, {
      shouldValidate: true,
    });
    setValue("amount", "250", {
      shouldValidate: true,
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setResult(null);
      reset({
        cardNumber: "",
        expirationDate: "",
        cvv: "",
        fullName: user.fullName,
        amount: "",
      });
    }

    onOpenChange(nextOpen);
  }

  async function onSubmit(values: PaymentForm) {
    setResult(null);

    const charge: SnailPayChargeRequest = {
      card_number: values.cardNumber,
      expiration_date: values.expirationDate,
      cvv: values.cvv,
      full_name: values.fullName.trim(),
      transaction_amount: Number(values.amount),
      payer_id: user.id,
      payer_email: user.email,
    };

    try {
      const response = await createCharge(charge);
      const newBalance =
        Math.round((user.balance + response.transaction_amount) * 100) / 100;

      saveAttempt(charge, response, "approved");
      onApproved(newBalance);

      setResult({
        kind: "success",
        message: `Recarga aprobada. Tu saldo aumentó $${response.transaction_amount.toFixed(2)}.`,
        response,
      });

      toast.success("Saldo actualizado correctamente.");
    } catch (error) {
      const snailPayError =
        error instanceof SnailPayRequestError
          ? error
          : new SnailPayRequestError(
              "La operación no pudo completarse.",
              "system",
            );

      const outcome: PaymentAttempt["outcome"] =
        snailPayError.reason === "timeout"
          ? "timeout"
          : snailPayError.reason === "transaction"
            ? "rejected"
            : "system_error";

      saveAttempt(charge, snailPayError.response, outcome);

      setResult({
        kind: "error",
        message: snailPayError.message,
        response: snailPayError.response,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-4xl font-semibold">
            Cargar saldo
          </DialogTitle>

          <DialogDescription>
            Simula una recarga mediante SnailPay. El saldo solo cambiará cuando
            la operación sea aprobada.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-2 text-sm font-semibold">Escenarios rápidos</p>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(scenarioCards) as Scenario[]).map((scenario) => (
              <Button
                key={scenario}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => applyScenario(scenario)}
              >
                {scenarioLabels[scenario]}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <form
          id="payment-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de tarjeta</Label>

            <Input
              id="cardNumber"
              inputMode="numeric"
              autoComplete="off"
              maxLength={16}
              placeholder="0000000000000000"
              aria-invalid={Boolean(errors.cardNumber)}
              {...register("cardNumber")}
            />

            {errors.cardNumber && (
              <p className="text-sm text-destructive">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Vencimiento</Label>

              <Input
                id="expirationDate"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                placeholder="MM/AA"
                aria-invalid={Boolean(errors.expirationDate)}
                {...register("expirationDate")}
              />

              {errors.expirationDate && (
                <p className="text-sm text-destructive">
                  {errors.expirationDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>

              <Input
                id="cvv"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={3}
                placeholder="000"
                aria-invalid={Boolean(errors.cvv)}
                {...register("cvv")}
              />

              {errors.cvv && (
                <p className="text-sm text-destructive">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>

              <Input
                id="fullName"
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />

              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto de la recarga</Label>

              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                max="100000"
                step="0.01"
                placeholder="250.00"
                aria-invalid={Boolean(errors.amount)}
                {...register("amount")}
              />

              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>
        </form>

        {result && (
          <Alert
            variant={result.kind === "error" ? "destructive" : "default"}
            className={
              result.kind === "success"
                ? "border-track-500 bg-track-100 text-track-700"
                : undefined
            }
          >
            {result.kind === "success" ? (
              <CheckCircle2 aria-hidden="true" />
            ) : (
              <AlertCircle aria-hidden="true" />
            )}

            <AlertTitle>
              {result.kind === "success"
                ? "Operación aprobada"
                : "Operación no aplicada"}
            </AlertTitle>

            <AlertDescription>
              {result.message}

              {result.response && (
                <span className="mt-1 block text-xs">
                  Referencia: {result.response.reference}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cerrar
          </Button>

          <Button type="submit" form="payment-form" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            Procesar recarga
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function saveAttempt(
  request: SnailPayChargeRequest,
  response: SnailPayResponse | null,
  outcome: PaymentAttempt["outcome"],
) {
  savePaymentAttempt({
    request,
    response,
    outcome,
    recordedAt: new Date().toISOString(),
  });
}
