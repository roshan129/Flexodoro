import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SessionPayloadInput {
  [key: string]: unknown;
}

interface SessionPayload {
  mode: "FIXED" | "FLEXIBLE";
  type?: "WORK" | "BREAK";
  durationSec: number;
  startedAt: string;
  endedAt?: string;
}

const ALLOWED_KEYS = new Set(["mode", "type", "durationSec", "startedAt", "endedAt"]);
const ALLOWED_MODES = new Set(["FIXED", "FLEXIBLE"]);
const ALLOWED_TYPES = new Set(["WORK", "BREAK"]);

type ValidationIssue = {
  field: keyof SessionPayload | "body";
  code: string;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDateString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function validateSessionPayload(body: SessionPayloadInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const key of Object.keys(body)) {
    if (!ALLOWED_KEYS.has(key)) {
      issues.push({
        field: "body",
        code: "unknown_field",
        message: `Unknown field: ${key}`,
      });
    }
  }

  if (!ALLOWED_MODES.has(String(body.mode))) {
    issues.push({
      field: "mode",
      code: "invalid_enum",
      message: "mode must be one of: FIXED, FLEXIBLE",
    });
  }

  if (body.type !== undefined && !ALLOWED_TYPES.has(String(body.type))) {
    issues.push({
      field: "type",
      code: "invalid_enum",
      message: "type must be one of: WORK, BREAK",
    });
  }

  if (
    typeof body.durationSec !== "number" ||
    !Number.isFinite(body.durationSec) ||
    !Number.isInteger(body.durationSec) ||
    body.durationSec <= 0
  ) {
    issues.push({
      field: "durationSec",
      code: "invalid_number",
      message: "durationSec must be a positive integer (seconds)",
    });
  }

  if (typeof body.startedAt !== "string" || !isValidDateString(body.startedAt)) {
    issues.push({
      field: "startedAt",
      code: "invalid_date",
      message: "startedAt must be a valid ISO date string",
    });
  }

  if (
    body.endedAt !== undefined &&
    (typeof body.endedAt !== "string" || !isValidDateString(body.endedAt))
  ) {
    issues.push({
      field: "endedAt",
      code: "invalid_date",
      message: "endedAt must be a valid ISO date string when provided",
    });
  }

  if (
    typeof body.startedAt === "string" &&
    isValidDateString(body.startedAt) &&
    typeof body.endedAt === "string" &&
    isValidDateString(body.endedAt)
  ) {
    const startedAtMs = Date.parse(body.startedAt);
    const endedAtMs = Date.parse(body.endedAt);
    if (endedAtMs < startedAtMs) {
      issues.push({
        field: "endedAt",
        code: "invalid_range",
        message: "endedAt must be greater than or equal to startedAt",
      });
    }
  }

  return issues;
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "invalid_json",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400 },
    );
  }

  if (!isRecord(rawBody)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "invalid_payload",
          message: "Request body must be a JSON object",
        },
      },
      { status: 400 },
    );
  }

  const issues = validateSessionPayload(rawBody as SessionPayloadInput);
  if (issues.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "validation_failed",
          message: "Session payload validation failed",
          issues,
        },
      },
      { status: 422 },
    );
  }

  const body = rawBody as SessionPayload;

  try {
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
