import { type Field, type FieldGroup, Prisma } from "@prisma/client";
import type { ContextType } from "../../../../types";
import type {
  UpdateItemInputType,
  AddToCollectionInputType,
  GetUserItemInputType,
  GetUserItemsInputType,
  GetYearsRangeInputType,
  ItemType,
} from "../types";
import { GetImdbDetailsById } from "../../parse/services";
import { GetEmbedding } from "../../embedding/services";
import { uploadImageByUrl } from "../../files/files.service";

// #region private functions

async function SetEmbedding(props: {
  ctx: ContextType;
  itemId: string;
  data: object | string;
}) {
  const { ctx, data, itemId } = props;
  const embedding = await GetEmbedding(data);
  try {
    await ctx.db.$executeRaw`
    UPDATE "Item"
    SET embedding = ARRAY[${Prisma.join(embedding)}]::float8[]
    WHERE id = ${itemId};
  `;
  } catch (error) {
    throw error;
  }
}

function FieldsToGroupedFields(
  fields: Array<Field & { fieldGroup: FieldGroup }>,
) {
  const groupedFields: Record<
    string,
    { name: string; priority: number; fields: string[] }
  > = {};

  fields.forEach((field) => {
    const { id: groupId, name: groupName, priority } = field.fieldGroup;

    if (!groupedFields[groupId]) {
      groupedFields[groupId] = {
        name: groupName,
        priority,
        fields: [],
      };
    }

    groupedFields[groupId].fields.push(field.value);
  });

  return Object.values(groupedFields)
    .sort((a, b) => a.priority - b.priority)
    .map((group) => ({
      name: group.name,
      fields: group.fields.sort(),
    }));
}

function dateToTimeAgoString(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Різниця в секундах

  const units = [
    { name: "year", seconds: 365 * 24 * 60 * 60 },
    { name: "month", seconds: 30 * 24 * 60 * 60 },
    { name: "week", seconds: 7 * 24 * 60 * 60 },
    { name: "day", seconds: 24 * 60 * 60 },
    { name: "hour", seconds: 60 * 60 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diff / unit.seconds);
    if (interval > 0) {
      return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

async function CreateImdbItem(props: {
  ctx: ContextType;
  id: string;
  collectionId: string;
}) {
  const { ctx, collectionId, id } = props;

  const transactionResult = await ctx.db.$transaction(
    async (prisma) => {
      const oldItem = await prisma.item.findFirst({
        where: {
          parsedId: id,
        },
      });

      if (oldItem) {
        return oldItem;
      }

      const details = await GetImdbDetailsById(id);

      if (!details.title) {
        throw new Error("Imdb parse error! Title not found!");
      }

      const image = await uploadImageByUrl(details.image);

      const item = await prisma.item.create({
        data: {
          collectionId: collectionId,
          title: details.title,
          year: details.year,
          description: details.plot,
          parsedId: id,
          image: image?.public_id ?? null,
        },
      });

      for (const [key, value] of Object.entries(details)) {
        if (
          key === "title" ||
          key === "image" ||
          key === "year" ||
          key === "plot"
        ) {
          continue;
        }
        const fieldGroup = await prisma.fieldGroup.findFirst({
          where: {
            name: key,
            collections: {
              some: {
                id: collectionId,
              },
            },
          },
        });
        if (!fieldGroup) {
          continue;
        }
        switch (typeof value) {
          case "number":
          case "string": {
            await prisma.field.upsert({
              where: {
                value: String(value),
              },
              create: {
                value: String(value),
                fieldGroupId: fieldGroup.id,
                items: {
                  connect: {
                    id: item.id,
                  },
                },
              },
              update: {
                items: {
                  connect: {
                    id: item.id,
                  },
                },
              },
            });
            break;
          }
          case "object": {
            if (!Array.isArray(value)) {
              continue;
            }
            for (const field of value) {
              await prisma.field.upsert({
                where: {
                  value: field,
                },
                create: {
                  value: field,
                  fieldGroupId: fieldGroup.id,
                  items: {
                    connect: {
                      id: item.id,
                    },
                  },
                },
                update: {
                  items: {
                    connect: {
                      id: item.id,
                    },
                  },
                },
              });
            }

            break;
          }
        }
      }

      await SetEmbedding({
        ctx,
        itemId: item.id,
        data: details,
      });

      return item;
    },
    { timeout: 120_000 },
  );

  return transactionResult;
}

// #endregion private functions

// #region public functions

export async function GetUserItems(props: {
  ctx: ContextType;
  input: GetUserItemsInputType;
}): Promise<ItemType[]> {
  const { ctx, input } = props;
  const limit = input?.limit ?? 20;
  const page = input?.page ?? 1;

  const rateFromFilter = input?.filtering
    ?.filter((filter) => filter.name === "rate")
    .find((filter) => filter.type === "from");
  const rateToFilter = input?.filtering
    ?.filter((filter) => filter.name === "rate")
    .find((filter) => filter.type === "to");
  const yearFromFilter = input?.filtering
    ?.filter((filter) => filter.name === "year")
    .find((filter) => filter.type === "from");
  const yearToFilter = input?.filtering
    ?.filter((filter) => filter.name === "year")
    .find((filter) => filter.type === "to");
  const statusIncludeFilter = input?.filtering
    ?.filter((filter) => filter.name === "status")
    .filter((filter) => filter.type === "include");
  const statusExcludeFilter = input?.filtering
    ?.filter((filter) => filter.name === "status")
    .filter((filter) => filter.type === "exclude");
  const fields =
    input?.filtering?.filter((filter) => filter.name === "field") ?? [];
  const includeFieldsIds = fields
    .filter((filter) => filter.type === "include")
    .map((field) => field.fieldId);
  const excludeFieldsIds = fields
    .filter((filter) => filter.type === "exclude")
    .map((field) => field.fieldId);

  const userItems = await ctx.db.userToItem.findMany({
    where: {
      userId: ctx.session.user.id,
      ...((rateFromFilter ??
        rateToFilter ??
        input?.sorting?.name === "rate") && {
        rate: {
          ...(rateToFilter && {
            lte: rateToFilter.value,
          }),
          ...(rateFromFilter && {
            gte: rateFromFilter.value,
          }),
        },
      }),
      ...((statusIncludeFilter?.length ?? statusExcludeFilter?.length) && {
        status: {
          ...(statusIncludeFilter && {
            in: statusIncludeFilter.map((filter) => filter.value),
          }),
          ...(statusExcludeFilter && {
            notIn: statusExcludeFilter.map((filter) => filter.value),
          }),
        },
      }),

      item: {
        ...(input?.search && {
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        }),
        ...(input?.collectionsIds?.length && {
          collectionId: {
            in: input?.collectionsIds,
          },
        }),
        ...((yearFromFilter ?? yearToFilter) && {
          year: {
            ...(yearToFilter && {
              lte: yearToFilter.value,
            }),
            ...(yearFromFilter && {
              gte: yearFromFilter.value,
            }),
          },
        }),
        ...((includeFieldsIds.length ?? excludeFieldsIds.length) && {
          fields: {
            ...(includeFieldsIds.length && {
              every: {
                id: {
                  in: includeFieldsIds,
                },
              },
            }),
            ...(excludeFieldsIds.length && {
              none: {
                id: {
                  in: excludeFieldsIds,
                },
              },
            }),
          },
        }),
      },
    },

    ...(input?.sorting && {
      orderBy: {
        ...(input.sorting.name === "rate" && {
          rate: {
            sort: input.sorting.type,
            nulls: "last",
          },
        }),
        ...(input.sorting.name === "status" && {
          status: input.sorting.type,
        }),
        ...(input.sorting.name === "date" && {
          updatedAt: input.sorting.type,
        }),
        ...(input.sorting.name === "year" && {
          item: {
            year: {
              sort: input.sorting.type,
              nulls: "last",
            },
          },
        }),
      },
    }),

    include: {
      item: {
        select: {
          id: true,
          title: true,
          year: true,
          description: true,
          image: true,
          collection: {
            select: {
              name: true,
            },
          },
          fields: {
            include: {
              fieldGroup: true,
            },
          },
        },
      },
    },

    take: limit,
    skip: (page - 1) * limit,
  });

  return userItems.map((userItems) => ({
    id: userItems.item.id,
    title: userItems.item.title,
    description: userItems.item.description,
    year: userItems.item.year,
    image: userItems.item.image,
    rate: userItems.rate,
    status: userItems.status,
    timeAgo: dateToTimeAgoString(userItems.updatedAt),
    updatedAt: userItems.updatedAt,
    collection: userItems.item.collection.name,
    fieldGroups: FieldsToGroupedFields(userItems.item.fields),
  }));
}

export async function GetUserItem(props: {
  ctx: ContextType;
  input: GetUserItemInputType;
}): Promise<ItemType | null> {
  const { ctx, input } = props;

  const userItem = await ctx.db.userToItem.findUnique({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input,
      },
    },

    include: {
      item: {
        select: {
          id: true,
          title: true,
          year: true,
          description: true,
          image: true,
          collection: {
            select: {
              name: true,
            },
          },
          fields: {
            include: {
              fieldGroup: true,
            },
          },
        },
      },
    },
  });

  if (!userItem) {
    return null;
  }

  return {
    id: userItem.item.id,
    title: userItem.item.title,
    description: userItem.item.description,
    year: userItem.item.year,
    image: userItem.item.image,
    rate: userItem.rate,
    status: userItem.status,
    timeAgo: dateToTimeAgoString(userItem.updatedAt),
    updatedAt: userItem.updatedAt,
    collection: userItem.item.collection.name,
    fieldGroups: FieldsToGroupedFields(userItem.item.fields),
  };
}

export async function GetYearsRange(props: {
  ctx: ContextType;
  input: GetYearsRangeInputType;
}) {
  const { ctx, input } = props;

  const yearRange = await ctx.db.item.aggregate({
    _min: {
      year: true,
    },
    _max: {
      year: true,
    },
    where: {
      year: {
        not: null,
      },
      userToItems: {
        some: {
          userId: ctx.session.user.id,
        },
      },
      ...(input?.length && {
        collectionId: {
          in: input,
        },
      }),
    },
  });

  return {
    minYear: yearRange._min.year,
    maxYear: yearRange._max.year,
  };
}

export async function AddToCollection(props: {
  ctx: ContextType;
  input: AddToCollectionInputType;
}) {
  const { ctx, input } = props;

  const collection = await ctx.db.collection.findUnique({
    where: { id: input.collectionId },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  let item;
  try {
    switch (collection.name) {
      case "Serie":
      case "Film":
        item = await CreateImdbItem({
          ctx,
          id: input.id,
          collectionId: collection.id,
        });
        break;
      default:
        throw new Error("Invalid collection name");
    }
  } catch (error) {
    console.log(error);
  }

  if (!item) {
    throw new Error("Something went wrong! Item not found!");
  }

  await ctx.db.userToItem.create({
    data: {
      userId: ctx.session.user.id,
      itemId: item.id,
      rate: input.rate ? input.rate : null,
      status: input.status,
      // tags: {
      //   connect: input.tags?.map((tag) => ({ id: tag })),
      // },
    },
  });

  return "Item added successfully!";
}

export async function UpdateItem(props: {
  ctx: ContextType;
  input: UpdateItemInputType;
}) {
  const { ctx, input } = props;

  const item = await ctx.db.item.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!item) {
    throw new Error("Item not found!");
  }

  await ctx.db.userToItem.update({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input.id,
      },
    },
    data: {
      rate: input.rate,
      status: input.status,
    },
  });

  return "Item updated successfully!";
}

// #endregion public functions
