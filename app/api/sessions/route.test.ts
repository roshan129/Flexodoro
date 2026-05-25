import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    session: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "./route";

const mockedCreate = vi.mocked(prisma.session.create);

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/sessions validation", () => {
  beforeEach(() => {
    mockedCreate.mockReset();
  });

  it("returns 201 for a valid payload", async () => {
    mockedCreate.mockResolvedValueOnce({
      id: "session_1",
      deviceId: "device-123",
      mode: "FIXED",
      type: "WORK",
      durationSec: 1500,
      startedAt: new Date("2026-05-16T10:00:00.000Z"),
      endedAt: new Date("2026-05-16T10:25:00.000Z"),
      createdAt: new Date("2026-05-16T10:25:00.000Z"),
    });

    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "FIXED",
        type: "WORK",
        durationSec: 1500,
        startedAt: "2026-05-16T10:00:00.000Z",
        endedAt: "2026-05-16T10:25:00.000Z",
      }),
    );

    expect(response.status).toBe(201);
    expect(mockedCreate).toHaveBeenCalledTimes(1);
  });

  it("returns 422 for invalid enum (mode)", async () => {
    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "POMODORO",
        durationSec: 1500,
        startedAt: "2026-05-16T10:00:00.000Z",
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.code).toBe("validation_failed");
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "mode", code: "invalid_enum" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 422 for invalid dates", async () => {
    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "FLEXIBLE",
        durationSec: 1200,
        startedAt: "not-a-date",
        endedAt: "also-not-a-date",
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "startedAt", code: "invalid_date" }),
        expect.objectContaining({ field: "endedAt", code: "invalid_date" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 422 for unknown fields", async () => {
    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "FLEXIBLE",
        durationSec: 1200,
        startedAt: "2026-05-16T10:00:00.000Z",
        unexpectedField: true,
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "body", code: "unknown_field" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 422 for negative duration", async () => {
    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "FIXED",
        durationSec: -5,
        startedAt: "2026-05-16T10:00:00.000Z",
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "durationSec", code: "invalid_number" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 422 for float duration", async () => {
    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "FIXED",
        durationSec: 12.5,
        startedAt: "2026-05-16T10:00:00.000Z",
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "durationSec", code: "invalid_number" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 422 when endedAt is earlier than startedAt", async () => {
    const response = await POST(
      makeRequest({
        deviceId: "device-123",
        mode: "FLEXIBLE",
        durationSec: 1200,
        startedAt: "2026-05-16T10:00:00.000Z",
        endedAt: "2026-05-16T09:59:59.000Z",
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "endedAt", code: "invalid_range" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 422 for missing deviceId", async () => {
    const response = await POST(
      makeRequest({
        mode: "FIXED",
        durationSec: 1500,
        startedAt: "2026-05-16T10:00:00.000Z",
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "deviceId", code: "invalid_string" }),
      ]),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });
});
