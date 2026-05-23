import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const FALLBACK_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/flexodoro?schema=public";
const databaseUrl = process.env.DATABASE_URL ?? FALLBACK_DATABASE_URL;
const isUsingFallbackUrl = !process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production" && isUsingFallbackUrl) {
  throw new Error("DATABASE_URL is not set in production. Refusing to use localhost fallback.");
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
