import type { Role } from "@prisma/client";
import type { ISODateString } from "next-auth";
import type { dbType } from "../db";

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
