import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AuthShell } from "./auth-shell";
import { useAuth } from "./use-auth";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Escribe tu nombre completo.")
      .max(80, "El nombre no puede superar 80 caracteres."),

    email: z.email("Ingresa un correo válido."),

    password: z
      .string()
      .min(8, "Usa al menos 8 caracteres.")
      .regex(/[A-Za-z]/, "Incluye al menos una letra.")
      .regex(/[0-9]/, "Incluye al menos un número."),

    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas deben coincidir.",
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { user, register: createAccount } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: RegisterForm) {
    setSubmitError(null);

    try {
      await createAccount(values);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No pudimos crear la cuenta.",
      );
    }
  }

  return (
    <AuthShell
      title="Prepara tu jornada"
      description="Crea la cuenta local que utilizarás para consultar resultados y administrar tu saldo."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>No fue posible crear la cuenta</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>

          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Nombre y apellidos"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "full-name-error" : undefined}
            {...register("fullName")}
          />

          {errors.fullName && (
            <p id="full-name-error" className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />

          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>

            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />

            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Confirmar contraseña</Label>

            <Input
              id="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.passwordConfirmation)}
              aria-describedby={
                errors.passwordConfirmation
                  ? "password-confirmation-error"
                  : undefined
              }
              {...register("passwordConfirmation")}
            />

            {errors.passwordConfirmation && (
              <p
                id="password-confirmation-error"
                className="text-sm text-destructive"
              >
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Usa al menos 8 caracteres, una letra y un número.
        </p>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          )}
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          className="font-semibold text-primary hover:underline"
          to="/login"
        >
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
