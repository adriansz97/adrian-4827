export const bettingSummary = {
  won: 8,
  lost: 4,
} as const;

export const snailResults = [
  { name: "Turbo", wins: 2 },
  { name: "Chet", wins: 1 },
  { name: "Chicotazo", wins: 1 },
  { name: "Polvora", wins: 1 },
  { name: "Derrape", wins: 1 },
  { name: "Sombra", wins: 0 },
] as const;

export const completedRaces = snailResults.reduce(
  (total, snail) => total + snail.wins,
  0,
);
