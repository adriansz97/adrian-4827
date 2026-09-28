import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/use-auth";

import { BalanceCard } from "./balance-card";
import { BettingChart } from "./betting-chart";
import { DashboardHeader } from "./dashboard-header";
import { RaceChart } from "./race-chart";

export function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <main className="min-h-svh bg-background px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader
          fullName={user.fullName}
          email={user.email}
          onLogout={logout}
        />

        <section className="py-10 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-lg text-muted-foreground">
                Bienvenido, {user.fullName.split(" ")[0]}
              </p>

              <h1 className="mt-2 max-w-3xl font-display text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
                El gran premio, de un vistazo
              </h1>
            </div>

            <Badge
              variant="secondary"
              className="w-fit rounded-full px-4 py-2 text-sm"
            >
              <CalendarDays aria-hidden="true" />
              Día simulado
            </Badge>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <BalanceCard
              balance={user.balance}
              onTopUp={() =>
                toast.info("La recarga se habilitará en el siguiente avance.")
              }
            />

            <BettingChart />
          </div>

          <div className="mt-6">
            <RaceChart />
          </div>
        </section>
      </div>
    </main>
  );
}
