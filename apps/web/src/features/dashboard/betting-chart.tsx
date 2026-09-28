import { Doughnut } from "react-chartjs-2";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "./charts";
import { bettingSummary } from "./dashboard-data";

const totalBets = bettingSummary.won + bettingSummary.lost;

const data = {
  labels: ["Ganadas", "Perdidas"],
  datasets: [
    {
      data: [bettingSummary.won, bettingSummary.lost],
      backgroundColor: ["#184c3a", "#d65d50"],
      borderColor: ["#fbfcfa", "#fbfcfa"],
      borderWidth: 4,
      hoverOffset: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "72%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
    },
  },
};

export function BettingChart() {
  const successRate = Math.round((bettingSummary.won / totalBets) * 100);

  return (
    <Card className="border-ink/15 bg-card/90">
      <CardHeader className="border-b border-border pb-5">
        <div>
          <CardDescription>Actividad simulada</CardDescription>

          <CardTitle className="font-display text-3xl font-semibold">
            Resultado de apuestas
          </CardTitle>
        </div>

        <CardAction>
          <span className="block whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
            {totalBets} total
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="grid items-center gap-7 pt-6 sm:grid-cols-[11rem_1fr]">
        <div className="relative mx-auto h-44 w-44">
          <Doughnut
            data={data}
            options={options}
            role="img"
            aria-label={`${bettingSummary.won} apuestas ganadas y ${bettingSummary.lost} perdidas`}
          />

          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <span className="block font-display text-4xl leading-none font-semibold">
                {successRate}%
              </span>

              <span className="text-xs text-muted-foreground">de acierto</span>
            </div>
          </div>
        </div>

        <dl className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2.5 rounded-full bg-primary" />
              Ganadas
            </dt>

            <dd className="font-display text-2xl font-semibold">
              {bettingSummary.won}
            </dd>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-3">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2.5 rounded-full bg-coral" />
              Perdidas
            </dt>

            <dd className="font-display text-2xl font-semibold">
              {bettingSummary.lost}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
