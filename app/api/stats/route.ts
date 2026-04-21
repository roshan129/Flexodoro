import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildStatsSummary } from "@/lib/stats";

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
