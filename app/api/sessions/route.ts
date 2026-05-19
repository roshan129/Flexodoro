import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SessionPayload {
  mode: "FIXED" | "FLEXIBLE";
  type?: "WORK" | "BREAK";
  durationSec: number;
  startedAt: string;
  endedAt?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SessionPayload;

    const session = await prisma.session.create({
      data: {
        mode: body.mode,
        type: body.type ?? "WORK",
        durationSec: body.durationSec,
        startedAt: new Date(body.startedAt),
        endedAt: body.endedAt ? new Date(body.endedAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error) {
    console.error("Failed to save session", error);
    return NextResponse.json(
      { success: false, message: "Failed to save session" },
      { status: 500 },
    );
  }
}
