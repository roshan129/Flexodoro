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
  const request = new Request("http://localhost/api/stats", {
    headers: { "x-device-id": "device-123" },
  });

  beforeEach(() => {
    mockedFindMany.mockReset();
  });

  it("returns a computed stats summary", async () => {
    mockedFindMany.mockResolvedValueOnce([
      { durationSec: 1200, startedAt: new Date(2026, 4, 16, 9, 0, 0) },
      { durationSec: 1800, startedAt: new Date(2026, 4, 16, 10, 0, 0) },
    ]);

    const response = await GET(request);
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
      where: { type: "WORK", deviceId: "device-123" },
      select: {
        durationSec: true,
        startedAt: true,
      },
      orderBy: { startedAt: "asc" },
    });
  });

  it("returns 500 when data fetch fails", async () => {
    mockedFindMany.mockRejectedValueOnce(new Error("db error"));

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Failed to compute stats",
    });
  });

  it("returns 400 when x-device-id header is missing", async () => {
    const response = await GET(new Request("http://localhost/api/stats"));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe("missing_device_id");
    expect(mockedFindMany).not.toHaveBeenCalled();
  });
});
