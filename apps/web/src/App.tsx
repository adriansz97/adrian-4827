import { Flag, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-5 py-8 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-24 border-x border-dashed border-track-500/30 lg:block" />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-ink/15 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Flag className="size-5" aria-hidden="true" />
            </span>

            <span className="font-display text-2xl font-semibold tracking-tight">
              Snail GP
            </span>
          </div>

          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Sesión segura
          </Badge>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Sigue cada resultado y mantén tu saldo listo para el siguiente
              gran premio.
            </p>

            <h1 className="font-display text-6xl leading-[0.9] font-semibold tracking-[-0.035em] text-balance sm:text-7xl lg:text-8xl">
              Seis caracoles. Una jornada.
            </h1>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" className="min-w-36">
                Iniciar sesión
              </Button>

              <Button size="lg" variant="outline" className="min-w-36">
                Crear cuenta
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden border-ink/15 bg-card/95 shadow-[0_24px_60px_-38px_rgba(23,32,27,0.55)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-saffron" />

            <CardHeader className="border-b border-border pb-5">
              <CardDescription>Preparación del día</CardDescription>

              <CardTitle className="font-display text-4xl font-semibold">
                Todo en la línea de salida
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
              <div className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-track-100 text-track-700">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>

                <div>
                  <p className="font-semibold">Información local protegida</p>

                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Tu perfil y saldo permanecen disponibles al volver.
                  </p>
                </div>
              </div>

              <div
                className="grid grid-cols-6 gap-2"
                aria-label="Seis posiciones de salida"
              >
                {[1, 2, 3, 4, 5, 6].map((position) => (
                  <div
                    key={position}
                    className="grid aspect-square place-items-center border-t-2 border-dashed border-track-500/40 font-display text-lg text-track-700"
                  >
                    {position}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default App;
