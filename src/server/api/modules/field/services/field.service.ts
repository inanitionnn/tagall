import type { ContextType } from "../../../../types";
import type { GetFilterFieldsInputType } from "../types";
import type { FilterFieldsType } from "../types";

export const GetFilterFields = async (props: {
  ctx: ContextType;
  input: GetFilterFieldsInputType;
}): Promise<FilterFieldsType[]> => {
  const { ctx, input } = props;

  const MINIMUM_ITEMS = 10;

  const fields = await ctx.db.field.findMany({
    select: {
      id: true,
      fieldGroup: {
        select: {
          collections: true,
          isFiltering: true,
        },
      },
      _count: {
        select: {
          items: {
            where: {
              collectionId: {
                in: input,
              },
            },
          },
        },
      },
    },
  });

  const fieldsIdsWithMinimumItems = fields
    .filter((field) => field._count.items >= MINIMUM_ITEMS)
    .map((field) => field.id);

  const fieldGroups = await ctx.db.fieldGroup.findMany({
    where: {
      isFiltering: true,
      ...(input.length && {
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
      priority: true,
      fields: {
        where: {
          id: {
            in: fieldsIdsWithMinimumItems,
          },
        },
        orderBy: {
          value: "asc",
        },
        select: {
          id: true,
          value: true,
        },
      },
      _count: {
        select: { fields: true },
      },
    },
    orderBy: {
      priority: "asc",
    },
  });

  return fieldGroups.filter((fieldGroup) => fieldGroup._count.fields > 0);
};
