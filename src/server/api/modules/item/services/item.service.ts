import type { ContextType } from "../../../../types";
import type {
  UpdateItemInputType,
  AddToCollectionInputType,
  GetUserItemInputType,
  GetUserItemsInputType,
  GetYearsRangeInputType,
  ItemType,
  DeleteFromCollectionInputType,
  ItemSmallType,
  GetRandomUserItemsInputType,
} from "../types";
import { GetImdbDetailsById } from "../../parse/services";
import { GetEmbedding } from "../../embedding/services";
import { uploadImageByUrl } from "../../files/files.service";
import { GetAnilistDetailsById } from "../../parse/services/anilist.service";
import { deleteCacheByPrefix, getOrSetCache } from "../../../../../lib/redis";
import {
  UpdateItemEmbedding,
  GetItemEmbedding,
  GetNearestItemsIds,
} from "./item-embedding.service";
import type { SearchItemByTextInputSchema } from "../types/search-item-by-text-input.type";
import { ItemResponseClass } from "../item-response.class";

const ItemResponse = new ItemResponseClass();

// #region private functions

async function UpdateEmbedding(props: {
  ctx: ContextType;
  itemId: string;
}): Promise<void> {
  const { ctx, itemId } = props;

  const item = await ctx.db.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      fields: true,
      collection: true,
    },
  });

  if (!item) {
    throw new Error("Item not found!");
  }

  const details = await ItemResponse.transformItemDetails({ ctx, item });

  const embedding = await GetEmbedding(details);

  await UpdateItemEmbedding({
    ctx,
    embedding,
    itemId,
  });
}

async function CreateItem(props: {
  ctx: ContextType;
  type: "imdb" | "anilist";
  parsedId: string;
  collectionId: string;
}) {
  const { ctx, collectionId, parsedId } = props;

  let details: any;

  const transactionResult = await ctx.db.$transaction(
    async (prisma) => {
      const oldItem = await prisma.item.findFirst({
        where: {
          parsedId,
        },
      });

      if (oldItem) {
        return oldItem;
      }

      switch (props.type) {
        case "imdb":
          details = await GetImdbDetailsById(parsedId);
          break;
        case "anilist":
          details = await GetAnilistDetailsById(parsedId);
          break;
        default:
          throw new Error("Invalid type");
      }

      if (!details?.title) {
        throw new Error("Parse error! Title not found!");
      }

      const image = await uploadImageByUrl(details.image);

      const item = await prisma.item.create({
        data: {
          collectionId: collectionId,
          title: details.title,
          year: details.year,
          description: details.description,
          parsedId,
          image: image?.public_id ?? null,
        },
      });

      const keys = Object.keys(details).filter(
        (k) => !["title", "image", "year", "description"].includes(k),
      );
      const fieldGroups = await prisma.fieldGroup.findMany({
        where: {
          name: {
            in: keys,
          },
          collections: {
            some: {
              id: collectionId,
            },
          },
        },
      });
      const fields: { field: string; fieldGroupId: string }[] = [];
      for (const fieldGroup of fieldGroups) {
        const value = details[fieldGroup.name as keyof typeof details]!;
        switch (typeof value) {
          case "number":
          case "string": {
            fields.push({ field: String(value), fieldGroupId: fieldGroup.id });
            break;
          }
          case "object": {
            if (!Array.isArray(value)) {
              continue;
            }
            for (const field of value) {
              fields.push({
                field: String(field),
                fieldGroupId: fieldGroup.id,
              });
            }
            break;
          }
        }
      }

      for (const { field, fieldGroupId } of fields) {
        await prisma.field.upsert({
          where: {
            value: field,
          },
          create: {
            value: field,
            fieldGroupId: fieldGroupId,
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
}): Promise<ItemSmallType[]> {
  const { ctx, input } = props;
  const redisKey = `item:GetUserItems:${ctx.session.user.id}:${JSON.stringify(input)}`;
  const limit = input?.limit ?? 20;
  const page = input?.page ?? 1;
  const promise = new Promise<ItemSmallType[]>((resolve) => {
    (async () => {
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
          ...((rateFromFilter || rateToFilter) && {
            rate: {
              ...(rateToFilter && {
                lte: rateToFilter.value,
              }),
              ...(rateFromFilter && {
                gte: rateFromFilter.value,
              }),
            },
          }),
          ...((statusIncludeFilter?.length || statusExcludeFilter?.length) && {
            status: {
              ...(statusIncludeFilter?.length && {
                in: statusIncludeFilter.map((filter) => filter.value),
              }),
              ...(statusExcludeFilter?.length && {
                not: {
                  in: statusExcludeFilter.map((filter) => filter.value),
                },
              }),
            },
          }),

          ...(input?.tagsIds?.length && {
            AND: input.tagsIds.map((tagId) => ({
              tags: {
                some: {
                  id: tagId,
                },
              },
            })),
          }),

          item: {
            ...(input?.search && {
              title: {
                contains: input.search,
                mode: "insensitive",
              },
            }),
            ...(input?.collectionsIds?.length && {
              collectionId: {
                in: input?.collectionsIds,
              },
            }),
            ...((yearFromFilter || yearToFilter) && {
              year: {
                ...(yearToFilter && {
                  lte: yearToFilter.value,
                }),
                ...(yearFromFilter && {
                  gte: yearFromFilter.value,
                }),
              },
            }),
            ...(includeFieldsIds.length && {
              AND: includeFieldsIds.map((id) => ({
                fields: {
                  some: {
                    id,
                  },
                },
              })),
            }),
            ...(excludeFieldsIds.length && {
              fields: {
                none: {
                  id: {
                    in: excludeFieldsIds,
                  },
                },
              },
            }),
          },
        },

        ...(input?.sorting && {
          ...(input.sorting.name === "rate" && {
            orderBy: [
              {
                rate: {
                  sort: input.sorting.type,
                  nulls: "last",
                },
              },
              { item: { title: "asc" } },
            ],
          }),
          ...(input.sorting.name === "status" && {
            orderBy: [
              { status: input.sorting.type },
              { item: { title: "asc" } },
            ],
          }),
          ...(input.sorting.name === "date" && {
            orderBy: [
              { updatedAt: input.sorting.type },
              { item: { title: "asc" } },
            ],
          }),
          ...(input.sorting.name === "year" && {
            orderBy: [
              {
                item: {
                  year: {
                    sort: input.sorting.type,
                    nulls: "last",
                  },
                },
              },
              { item: { title: "asc" } },
            ],
          }),
          ...(input.sorting.name === "title" && {
            orderBy: [
              { item: { title: input.sorting.type } },
              {
                item: {
                  year: {
                    sort: "desc",
                    nulls: "last",
                  },
                },
              },
            ],
          }),
        }),

        include: {
          tags: true,
          item: {
            include: {
              collection: true,
            },
          },
        },

        take: limit,
        skip: (page - 1) * limit,
      });

      return resolve(ItemResponse.transformUserItems(userItems));
    })();
  });

  return getOrSetCache<ItemSmallType[]>(redisKey, promise);
}

export async function GetUserItem(props: {
  ctx: ContextType;
  input: GetUserItemInputType;
}): Promise<ItemType | null> {
  const { ctx, input } = props;

  const LIMIT = 8;

  const redisKey = `item:GetUserItem:${ctx.session.user.id}:${input}`;

  const promise = new Promise<ItemType | null>((resolve) => {
    (async () => {
      const userItem = await ctx.db.userToItem.findUnique({
        where: {
          userId_itemId: {
            userId: ctx.session.user.id,
            itemId: input,
          },
        },
        include: {
          item: {
            include: {
              collection: true,
              fields: true,
            },
          },
          tags: true,
          itemComments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!userItem) {
        return resolve(null);
      }

      const itemEmbedding = await GetItemEmbedding({
        ctx,
        itemId: input,
      });

      const nearestItemsIds = await GetNearestItemsIds({
        ctx,
        embedding: itemEmbedding,
        limit: LIMIT,
      });

      const nearestUserItems = await ctx.db.userToItem.findMany({
        where: {
          userId: ctx.session.user.id,
          item: {
            id: {
              in: nearestItemsIds,
            },
          },
        },
        include: {
          tags: true,
          item: {
            include: {
              collection: true,
              fields: true,
            },
          },
        },
      });

      return resolve(
        ItemResponse.transformUserItem({
          ctx,
          similarUserItems: nearestUserItems,
          userItem,
        }),
      );
    })();
  });

  return getOrSetCache<ItemType | null>(redisKey, promise);
}

export async function GetYearsRange(props: {
  ctx: ContextType;
  input: GetYearsRangeInputType;
}) {
  const { ctx, input } = props;

  const redisKey = `item:GetYearsRange:${ctx.session.user.id}:${JSON.stringify(input)}`;

  const promise = ctx.db.item
    .aggregate({
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
    })
    .then((yearRange) => {
      return {
        minYear: yearRange._min.year,
        maxYear: yearRange._max.year,
      };
    });

  return getOrSetCache(redisKey, promise);
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
        item = await CreateItem({
          ctx,
          type: "imdb",
          parsedId: input.parsedId,
          collectionId: collection.id,
        });
        break;
      case "Manga":
        item = await CreateItem({
          ctx,
          type: "anilist",
          parsedId: input.parsedId,
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

  await UpdateEmbedding({ ctx, itemId: item.id });

  const userToItem = await ctx.db.userToItem.create({
    data: {
      userId: ctx.session.user.id,
      itemId: item.id,
      rate: input.rate ? input.rate : null,
      status: input.status,
      ...(input.tagsIds?.length && {
        tags: {
          connect: input.tagsIds.map((tag) => ({ id: tag })),
        },
      }),
    },
  });

  if (input.comment) {
    await ctx.db.itemComment.create({
      data: {
        title: input.comment.title,
        description: input.comment.description
          ? input.comment.description
          : null,
        rate: input.rate,
        status: input.status,
        userToItemId: userToItem.id,
      },
    });
  }

  const userItemsKey = `item:GetUserItems:${ctx.session.user.id}`;
  await deleteCacheByPrefix(userItemsKey);
  const userYearsRangeKey = `item:GetYearsRange:${ctx.session.user.id}`;
  await deleteCacheByPrefix(userYearsRangeKey);

  return "Item added successfully!";
}

export async function UpdateItem(props: {
  ctx: ContextType;
  input: UpdateItemInputType;
}) {
  const { ctx, input } = props;

  const item = await ctx.db.userToItem.findUnique({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input.id,
      },
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
      ...(input.tagsIds && {
        tags: { set: input.tagsIds.map((tag) => ({ id: tag })) },
      }),
    },
  });

  const userItemsKey = `item:GetUserItems:${ctx.session.user.id}`;
  await deleteCacheByPrefix(userItemsKey);
  const userItemKey = `item:GetUserItem:${ctx.session.user.id}:${input.id}`;
  await deleteCacheByPrefix(userItemKey);

  return "Item updated successfully!";
}

export async function DeleteFromCollection(props: {
  ctx: ContextType;
  input: DeleteFromCollectionInputType;
}) {
  const { ctx, input } = props;

  const item = await ctx.db.userToItem.findUnique({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input,
      },
    },
  });

  if (!item) {
    throw new Error("Item not found!");
  }

  await ctx.db.userToItem.delete({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input,
      },
    },
  });

  const userItemsKey = `item:GetUserItems:${ctx.session.user.id}`;
  await deleteCacheByPrefix(userItemsKey);
  const userItemKey = `item:GetUserItem:${ctx.session.user.id}:${input}`;
  await deleteCacheByPrefix(userItemKey);
  const userYearsRangeKey = `item:GetYearsRange:${ctx.session.user.id}`;
  await deleteCacheByPrefix(userYearsRangeKey);

  return "Item deleted successfully!";
}

export async function SearchItemByText(props: {
  ctx: ContextType;
  input: SearchItemByTextInputSchema;
}) {
  const { ctx, input } = props;

  const embedding = await GetEmbedding(input);

  const nearestItemsIds = await GetNearestItemsIds({
    ctx,
    embedding,
    limit: 12,
  });

  const nearestUserItems = await ctx.db.userToItem.findMany({
    where: {
      userId: ctx.session.user.id,
      item: {
        id: {
          in: nearestItemsIds,
        },
      },
    },
    include: {
      tags: true,
      item: {
        include: {
          collection: true,
        },
      },
    },
  });

  return ItemResponse.transformUserItems(nearestUserItems);
}

export async function GetRandomUserItems(props: {
  ctx: ContextType;
  input: GetRandomUserItemsInputType;
}): Promise<ItemSmallType[]> {
  const { ctx, input } = props;

  const limit = input?.limit ?? 12;

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

  const radndomUserItems = await ctx.db.userToItem.findManyRandom(limit, {
    where: {
      userId: ctx.session.user.id,
      ...((rateFromFilter || rateToFilter) && {
        rate: {
          ...(rateToFilter && {
            lte: rateToFilter.value,
          }),
          ...(rateFromFilter && {
            gte: rateFromFilter.value,
          }),
        },
      }),
      ...((statusIncludeFilter?.length || statusExcludeFilter?.length) && {
        status: {
          ...(statusIncludeFilter?.length && {
            in: statusIncludeFilter.map((filter) => filter.value),
          }),
          ...(statusExcludeFilter?.length && {
            not: {
              in: statusExcludeFilter.map((filter) => filter.value),
            },
          }),
        },
      }),

      ...(input?.tagsIds?.length && {
        AND: input.tagsIds.map((tagId) => ({
          tags: {
            some: {
              id: tagId,
            },
          },
        })),
      }),

      item: {
        ...(input?.collectionsIds?.length && {
          collectionId: {
            in: input?.collectionsIds,
          },
        }),
        ...((yearFromFilter || yearToFilter) && {
          year: {
            ...(yearToFilter && {
              lte: yearToFilter.value,
            }),
            ...(yearFromFilter && {
              gte: yearFromFilter.value,
            }),
          },
        }),
        ...(includeFieldsIds.length && {
          AND: includeFieldsIds.map((id) => ({
            fields: {
              some: {
                id,
              },
            },
          })),
        }),
        ...(excludeFieldsIds.length && {
          fields: {
            none: {
              id: {
                in: excludeFieldsIds,
              },
            },
          },
        }),
      },
    },
    select: {
      id: true,
    },
  });

  const userItems = await ctx.db.userToItem.findMany({
    where: {
      id: {
        in: radndomUserItems.map((item) => item.id),
      },
    },
    include: {
      tags: true,
      item: {
        include: {
          collection: true,
        },
      },
    },
  });

  return ItemResponse.transformUserItems(userItems);
}

export async function UpdateAllEmbeddings(props: { ctx: ContextType }) {
  const { ctx } = props;

  const items = await ctx.db.item.findMany();
  console.log(`Found ${items.length} items`);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item) {
      console.log(`==============START ${i}=======================`);
      console.log(`${i}) Updating ${item.title}`);
      try {
        await UpdateEmbedding({ ctx, itemId: item.id });
      } catch (error) {
        console.log(`Error updating ${item.title}`);
        console.log(error);
      }
      console.log(`=================END ${i}====================`);
    }
  }

  console.log("CRON finished");
}

// #endregion public functions
