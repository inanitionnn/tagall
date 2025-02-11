import type { ContextType } from "../../../../types";
import type {
  AddTagInputType,
  DeleteTagInputType,
  GetUserTagsInputType,
  UpdateTagInputType,
} from "../types";
import type { TagType } from "../types/tag.type";

export async function GetUserTags(props: {
  ctx: ContextType;
  input: GetUserTagsInputType;
}): Promise<TagType[]> {
  const { ctx, input } = props;

  const tags = await ctx.db.tag.findMany({
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
    include: {
      collections: true,
      _count: {
        select: {
          userToItems: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags;
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
      ...(input.collectionsIds?.length && {
        collections: {
          connect: input.collectionsIds?.map((id) => ({ id })),
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
      ...(input.collectionsIds?.length && {
        collections: {
          set: input.collectionsIds?.map((id) => ({ id })),
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
