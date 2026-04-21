import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildInsightsSummary } from "@/lib/stats";

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      where: { type: "WORK" },
      select: {
        durationSec: true,
        startedAt: true,
      },
      orderBy: { startedAt: "asc" },
    });

    const insights = buildInsightsSummary(sessions);

    return NextResponse.json({ success: true, data: insights }, { status: 200 });
  } catch (error) {
    console.error("Failed to compute insights", error);
    return NextResponse.json(
      { success: false, message: "Failed to compute insights" },
      { status: 500 },
    );
  }
}
