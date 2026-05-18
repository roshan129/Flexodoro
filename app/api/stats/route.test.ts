import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    session: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET } from "./route";

const mockedFindMany = vi.mocked(prisma.session.findMany);

describe("GET /api/stats", () => {
  beforeEach(() => {
    mockedFindMany.mockReset();
  });

  it("returns a computed stats summary", async () => {
    mockedFindMany.mockResolvedValueOnce([
      { durationSec: 1200, startedAt: new Date(2026, 4, 16, 9, 0, 0) },
      { durationSec: 1800, startedAt: new Date(2026, 4, 16, 10, 0, 0) },
    ]);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(
      expect.objectContaining({
        totalTimeSec: 3000,
        sessionsCount: 2,
        avgSessionSec: 1500,
      }),
    );
    expect(json.data.weeklyTrend).toHaveLength(7);
    expect(mockedFindMany).toHaveBeenCalledWith({
      where: { type: "WORK" },
      select: {
        durationSec: true,
        startedAt: true,
      },
      orderBy: { startedAt: "asc" },
    });
  });

  it("returns 500 when data fetch fails", async () => {
    mockedFindMany.mockRejectedValueOnce(new Error("db error"));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Failed to compute stats",
    });
  });
});
