import { LogOut, WalletCards } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/use-auth";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <main className="min-h-svh bg-background px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-ink/15 pb-5">
          <BrandMark />

          <Button variant="outline" onClick={logout}>
            <LogOut aria-hidden="true" />
            Cerrar sesión
          </Button>
        </header>

        <section className="py-12">
          <p className="text-lg text-muted-foreground">
            Bienvenido, {user.fullName}
          </p>

          <h1 className="mt-2 font-display text-6xl leading-none font-semibold tracking-tight">
            Resumen del gran premio
          </h1>

          <Card className="mt-10 max-w-md border-ink/15">
            <CardHeader>
              <CardDescription>Saldo disponible</CardDescription>

              <CardTitle className="font-display text-5xl font-semibold">
                {currencyFormatter.format(user.balance)}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
              <WalletCards className="size-5 text-primary" aria-hidden="true" />
              Las recargas estarán disponibles en el siguiente avance.
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
