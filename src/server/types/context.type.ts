import { PrismaClient, Role } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ISODateString } from "next-auth";

export type ContextType = {
  db: PrismaClient<
    {
      log: ("query" | "warn" | "error")[];
    },
    never,
    DefaultArgs
  >;
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
