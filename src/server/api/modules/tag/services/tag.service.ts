import type { ContextType } from "../../../../types";
import type {
  AddTagInputType,
  DeleteTagInputType,
  GetUserTagsInputType,
  UpdateTagInputType,
} from "../types";

export async function GetUserTags(props: {
  ctx: ContextType;
  input: GetUserTagsInputType;
}) {
  const { ctx, input } = props;

  return ctx.db.tag.findMany({
    where: {
      userId: ctx.session.user.id,
      collections: {
        some: {
          id: {
            in: input,
          },
        },
      },
    },
  });
}

export async function AddTag(props: {
  ctx: ContextType;
  input: AddTagInputType;
}) {
  const { ctx, input } = props;

  await ctx.db.tag.create({
    data: {
      name: input.name,
      userId: ctx.session.user.id,
      ...(input.collectionIds && {
        collections: {
          connect: input.collectionIds?.map((id) => ({ id })),
        },
      }),
    },
  });

  return "Tag created successfully!";
}

export async function UpdateTag(props: {
  ctx: ContextType;
  input: UpdateTagInputType;
}) {
  const { ctx, input } = props;

  await ctx.db.tag.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      ...(input.collectionIds && {
        collections: {
          set: input.collectionIds?.map((id) => ({ id })),
        },
      }),
    },
  });

  return "Tag updated successfully!";
}

export async function DeleteTag(props: {
  ctx: ContextType;
  input: DeleteTagInputType;
}) {
  const { ctx, input } = props;

  const tag = await ctx.db.tag.findUnique({
    where: {
      id: input,
    },
  });

  if (!tag) {
    throw new Error("Tag not found!");
  }

  await ctx.db.tag.delete({
    where: {
      id: input,
    },
  });

  return "Tag deleted successfully!";
}

// #endregion public functions
