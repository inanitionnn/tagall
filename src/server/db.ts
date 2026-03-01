import { PrismaClient } from "@prisma/client";
import prismaRandom from "prisma-extension-random";
import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log: ["error"],
  }).$extends(prismaRandom());

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();
export type dbType = typeof db;
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
