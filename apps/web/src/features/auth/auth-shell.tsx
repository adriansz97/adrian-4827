import type { PropsWithChildren } from "react";

import { BrandMark } from "@/components/brand-mark";

interface AuthShellProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-y-0 right-20 w-24 border-x border-dashed border-white/25" />

        <BrandMark className="relative [&_span:first-child]:bg-saffron [&_span:first-child]:text-ink" />

        <div className="relative max-w-xl pb-10">
          <p className="mb-5 max-w-md text-lg leading-relaxed text-white/70">
            Una jornada compacta para seguir resultados y administrar tu saldo.
          </p>

          <p className="font-display text-7xl leading-[0.88] font-semibold tracking-[-0.035em]">
            Seis caracoles.
            <br />
            Un gran premio.
          </p>
        </div>

        <div className="relative grid grid-cols-6 gap-3 border-t border-white/25 pt-4 font-display text-lg text-white/65">
          {[1, 2, 3, 4, 5, 6].map((position) => (
            <span key={position}>{position}</span>
          ))}
        </div>
      </section>

      <section className="flex min-h-svh items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <BrandMark className="mb-12 lg:hidden" />

          <div className="mb-8">
            <h1 className="font-display text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
              {title}
            </h1>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
