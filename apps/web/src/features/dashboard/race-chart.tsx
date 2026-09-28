import { Bar } from "react-chartjs-2";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "./charts";
import { completedRaces, snailResults } from "./dashboard-data";

const data = {
  labels: snailResults.map((snail) => snail.name),

  datasets: [
    {
      label: "Victorias",
      data: snailResults.map((snail) => snail.wins),

      backgroundColor: [
        "#184c3a",
        "#4f7cac",
        "#78927d",
        "#e0a11a",
        "#d65d50",
        "#b8c5bb",
      ],

      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 44,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      displayColors: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },

      border: {
        display: false,
      },

      ticks: {
        color: "#5d6a62",

        font: {
          family: "Source Sans 3",
        },
      },
    },

    y: {
      beginAtZero: true,
      suggestedMax: 3,

      ticks: {
        stepSize: 1,
        color: "#5d6a62",
      },

      grid: {
        color: "rgba(93, 106, 98, 0.15)",
      },

      border: {
        display: false,
      },
    },
  },
};

export function RaceChart() {
  return (
    <Card className="border-ink/15 bg-card/90">
      <CardHeader className="border-b border-border pb-5">
        <div>
          <CardDescription>Seis competidores</CardDescription>

          <CardTitle className="font-display text-3xl font-semibold">
            Victorias del gran premio
          </CardTitle>
        </div>

        <CardAction className="text-right">
          <span className="block font-display text-3xl leading-none font-semibold">
            {completedRaces}/6
          </span>

          <span className="text-xs text-muted-foreground">carreras</span>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-72 w-full">
          <Bar
            data={data}
            options={options}
            role="img"
            aria-label="Victorias de seis caracoles durante seis carreras simuladas"
          />
        </div>
      </CardContent>
    </Card>
  );
}
