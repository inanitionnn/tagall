import type { PrismaClient, Role, Prisma } from "@prisma/client";
import type { ISODateString } from "next-auth";
import { dbType } from "../db";

export type ContextType = {
  db: dbType;
  session: {
    user: {
      id: string;
      role?: Role;
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: ISODateString;
  };
  headers: Headers;
};
