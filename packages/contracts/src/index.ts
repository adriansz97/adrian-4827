import { z } from "zod";

export const APP_NAME = "Snail GP";

export const snailPayChargeSchema = z.object({
  card_number: z
    .string()
    .regex(/^\d{16}$/, "El número de tarjeta debe contener 16 dígitos."),

  expiration_date: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "La fecha debe utilizar el formato MM/AA.",
    ),

  cvv: z.string().regex(/^\d{3}$/, "El CVV debe contener 3 dígitos."),

  full_name: z.string().trim().min(1, "El nombre completo es obligatorio."),

  transaction_amount: z
    .number()
    .positive("El monto debe ser mayor que cero.")
    .max(100_000, "El monto no puede superar $100,000."),

  payer_id: z.uuid("El identificador del usuario no es válido."),

  payer_email: z.email("El correo del usuario no es válido."),
});

export type SnailPayChargeRequest = z.infer<typeof snailPayChargeSchema>;

export const snailPayStatusSchema = z.enum(["approved", "rejected", "error"]);

export const snailPayResponseSchema = z.object({
  id: z.string(),
  status: snailPayStatusSchema,
  status_detail: z.string(),
  transaction_amount: z.number(),
  date_created: z.string(),
  authorization_code: z.string().nullable(),
  reference: z.string(),
  payer_id: z.string(),
  payer_email: z.string(),
  card_number: z.string(),
  cvv: z.string(),
});

export type SnailPayResponse = z.infer<typeof snailPayResponseSchema>;
