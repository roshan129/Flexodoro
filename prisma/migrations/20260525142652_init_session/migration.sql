-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SessionMode" AS ENUM ('FIXED', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('WORK', 'BREAK');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "mode" "SessionMode" NOT NULL,
    "type" "SessionType" NOT NULL DEFAULT 'WORK',
    "durationSec" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
