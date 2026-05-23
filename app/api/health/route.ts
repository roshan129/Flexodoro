import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.session.findFirst({
      select: { id: true },
    });

    return NextResponse.json(
      {
        status: "ok",
        service: "flexodoro-api",
        checks: {
          dbConnection: "ok",
          sessionSchema: "ok",
        },
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Health check failed", { message });

    return NextResponse.json(
      {
        status: "degraded",
        service: "flexodoro-api",
        checks: {
          dbConnection: "failed",
          sessionSchema: "failed",
        },
        error: {
          message,
        },
        timestamp,
      },
      { status: 503 },
    );
  }
}
