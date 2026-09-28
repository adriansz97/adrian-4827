import { Plus, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

interface BalanceCardProps {
  balance: number;
  onTopUp?: () => void;
}

export function BalanceCard({ balance, onTopUp }: BalanceCardProps) {
  return (
    <section className="relative flex min-h-72 flex-col justify-between overflow-hidden rounded-[2rem_0.75rem_2rem_0.75rem] bg-primary p-7 text-primary-foreground shadow-[0_28px_60px_-40px_rgba(24,76,58,0.9)]">
      <div className="absolute -right-8 -bottom-8 size-44 rounded-full border-26 border-white/6" />

      <div className="relative flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-white/75">
          <WalletCards className="size-4" aria-hidden="true" />
          Saldo disponible
        </p>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          MXN
        </span>
      </div>

      <div className="relative py-7">
        <p className="font-display text-6xl leading-none font-semibold tracking-tight sm:text-7xl">
          {currencyFormatter.format(balance)}
        </p>

        <p className="mt-3 text-sm text-white/65">
          El saldo se conserva en este dispositivo.
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onTopUp}
        className="relative w-full bg-saffron text-ink hover:bg-saffron/90"
      >
        <Plus aria-hidden="true" />
        Cargar saldo
      </Button>
    </section>
  );
}
