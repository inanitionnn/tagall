import type { User } from "@prisma/client";
import { env } from "../../../env";
import type { db } from "../../db";

export const getFirstAllowedUser = async (
  prisma: typeof db,
): Promise<User | null> => {
  const firstEmail = env.ALLOWED_EMAILS.split(",")[0]?.trim();
  
  if (!firstEmail) {
    throw new Error("No allowed emails configured");
  }

  const user = await prisma.user.findUnique({
    where: { email: firstEmail },
  });

  return user;
};
