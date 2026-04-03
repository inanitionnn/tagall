import type { User } from "@prisma/client";
import { env } from "../../../env";
import type { db } from "../../db";

const CACHE_TTL_MS = 60_000;

let cachedUser: User | null = null;
let cacheExpiresAt = 0;

export const getFirstAllowedUser = async (
  prisma: typeof db,
): Promise<User | null> => {
  if (cachedUser && Date.now() < cacheExpiresAt) {
    return cachedUser;
  }

  const firstEmail = env.ALLOWED_EMAILS.split(",")[0]?.trim();

  if (!firstEmail) {
    throw new Error("No allowed emails configured");
  }

  const user = await prisma.user.findUnique({
    where: { email: firstEmail },
  });

  cachedUser = user;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;

  return user;
};
