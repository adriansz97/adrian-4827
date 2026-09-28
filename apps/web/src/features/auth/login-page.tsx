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

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: LoginForm) {
    setSubmitError(null);

    try {
      await login(values);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos iniciar la sesión.",
      );
    }
  }

  return (
    <AuthShell
      title="Vuelve a la pista"
      description="Ingresa con el correo y la contraseña que registraste en este dispositivo."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>No fue posible ingresar</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

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

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
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

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          )}
          Iniciar sesión
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        ¿Es tu primera visita?{" "}
        <Link
          className="font-semibold text-primary hover:underline"
          to="/register"
        >
          Crear una cuenta
        </Link>
      </p>
    </AuthShell>
  );
}
