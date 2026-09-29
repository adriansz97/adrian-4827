import { describe, expect, it } from "vitest";

import { bettingSummary, completedRaces, snailResults } from "./dashboard-data";

describe("simulated dashboard data", () => {
  it("represents exactly six snails and six completed races", () => {
    const totalWins = snailResults.reduce(
      (total, snail) => total + snail.wins,
      0,
    );

    expect(snailResults).toHaveLength(6);
    expect(completedRaces).toBe(6);
    expect(totalWins).toBe(completedRaces);
    expect(snailResults.every((snail) => snail.wins >= 0)).toBe(true);
  });

  it("keeps won and lost bets as positive coherent counts", () => {
    expect(bettingSummary.won).toBeGreaterThan(0);
    expect(bettingSummary.lost).toBeGreaterThan(0);
  });
});
