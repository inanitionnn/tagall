import type { User } from "@prisma/client";
import { getOrSetCache } from "../../../../../lib/redis";
import type { ContextType } from "../../../../types";
import type { UpdateUserInputType } from "../types";

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
  await ctx.db.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      image: input.image,
      name: input.name,
    },
  });

  return "User updated successfully";
}
