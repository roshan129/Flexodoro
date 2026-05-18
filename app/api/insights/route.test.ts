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

describe("GET /api/insights", () => {
  beforeEach(() => {
    mockedFindMany.mockReset();
  });

  it("returns computed insights summary", async () => {
    mockedFindMany.mockResolvedValueOnce([
      { durationSec: 1800, startedAt: new Date(2026, 4, 16, 9, 0, 0) },
      { durationSec: 1200, startedAt: new Date(2026, 4, 16, 9, 30, 0) },
      { durationSec: 900, startedAt: new Date(2026, 4, 16, 14, 0, 0) },
    ]);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(
      expect.objectContaining({
        bestFocusTime: "9:00 AM",
        avgSessionLengthSec: 1300,
        personalBestDay: {
          date: "2026-05-16",
          totalDurationSec: 3900,
        },
      }),
    );
    expect(Array.isArray(json.data.hourlyFocusSec)).toBe(true);
    expect(json.data.hourlyFocusSec).toHaveLength(24);
    expect(
      json.data.hourlyFocusSec.find((item: { hour: number; totalDurationSec: number }) => item.hour === 9)
        ?.totalDurationSec,
    ).toBe(3000);
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
      message: "Failed to compute insights",
    });
  });
});
