import { getOrSetCache } from "../../../../../lib/redis";
import type { ContextType } from "../../../../types";
import type { GetFilterFieldsInputType } from "../types";
import type { FilterFieldsType } from "../types";

export const GetFilterFields = async (props: {
  ctx: ContextType;
  input: GetFilterFieldsInputType;
}): Promise<FilterFieldsType[]> => {
  const { ctx, input } = props;

  const redisKey = `field:GetFilterFields:${JSON.stringify(input)}`;

  const promise = ctx.db.fieldGroup.findMany({
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
        orderBy: {
          value: "asc",
        },
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

  return getOrSetCache<FilterFieldsType[]>(redisKey, promise);
};
