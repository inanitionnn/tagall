import type { ContextType } from "../../../../types";
import type { GetFilterFieldsInputType } from "../types";

export const GetFilterFields = async (props: {
  ctx: ContextType;
  input: GetFilterFieldsInputType;
}) => {
  const { ctx, input } = props;

  return ctx.db.fieldGroup.findMany({
    where: {
      isFiltering: true,
      ...(input?.length && {
        collections: {
          some: {
            id: {
              in: input,
            },
          },
        },
      }),
    },
    select: {
      id: true,
      name: true,
      fields: {
        ...(input?.length && {
          where: {
            items: {
              some: {
                collectionId: {
                  in: input,
                },
              },
            },
          },
        }),
        select: {
          id: true,
          value: true,
        },
      },
      priority: true,
    },
    orderBy: {
      priority: "asc",
    },
  });
};
