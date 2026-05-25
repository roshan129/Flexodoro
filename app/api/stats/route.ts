import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildStatsSummary } from "@/lib/stats";

function getDeviceIdFromRequest(request: Request): string | null {
  const deviceId = request.headers.get("x-device-id")?.trim();
  if (!deviceId || deviceId.length > 128) {
    return null;
  }
  return deviceId;
}

export async function GET(request: Request) {
  const deviceId = getDeviceIdFromRequest(request);
  if (!deviceId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "missing_device_id",
          message: "x-device-id header is required",
        },
      },
      { status: 400 },
    );
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { type: "WORK", deviceId },
      select: {
        durationSec: true,
        startedAt: true,
      },
      orderBy: { startedAt: "asc" },
    });

    const summary = buildStatsSummary(sessions);

    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error) {
    console.error("Failed to compute stats", error);
    return NextResponse.json(
      { success: false, message: "Failed to compute stats" },
      { status: 500 },
    );
  }
}
