import type { User } from "@prisma/client";
import { deleteCacheByPrefix, getOrSetCache } from "../../../../../lib/redis";
import type { ContextType } from "../../../../types";
import type { UpdateUserInputType } from "../types";
import { DeleteFile } from "../../files/files.service";

export async function GetUser(props: { ctx: ContextType }): Promise<User> {
  const { ctx } = props;
  const redisKey = `user:GetUser:${ctx.session.user.id}`;

  const promise = new Promise<User>((resolve, reject) => {
    (async () => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        return reject(new Error("User not found"));
      }
      return resolve(user);
    })();
  });

  return getOrSetCache<User>(redisKey, promise);
}

export async function UpdateUser(props: {
  ctx: ContextType;
  input: UpdateUserInputType;
}) {
  const { ctx, input } = props;
  const user = await ctx.db.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (input.image === null && user.image !== null) {
    await DeleteFile("profile", user.image);
  }
  await ctx.db.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      image: input.image,
      name: input.name,
    },
  });

  const redisKey = `user:GetUser:${ctx.session.user.id}`;
  await deleteCacheByPrefix(redisKey);

  return "User updated successfully";
}
