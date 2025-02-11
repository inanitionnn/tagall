import type { User } from "@prisma/client";
import type { ContextType } from "../../../../types";
import type { UpdateUserInputType } from "../types";
import { DeleteFile } from "../../files/files.service";

export async function GetUser(props: { ctx: ContextType }): Promise<User> {
  const { ctx } = props;

  const user = await ctx.db.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
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

  return "User updated successfully";
}
