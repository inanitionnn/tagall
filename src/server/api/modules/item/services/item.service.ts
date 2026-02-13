import type { ContextType } from "../../../../types";
import type {
  UpdateItemInputType,
  UpdateItemImageInputType,
  AddToCollectionInputType,
  GetUserItemInputType,
  GetUserItemsInputType,
  GetAllUserItemsInputType,
  GetYearsRangeInputType,
  DeleteFromCollectionInputType,
  ItemType,
  TierItemType,
  GetRandomUserItemsInputType,
  GetUserItemsStatsInputType,
  ItemsStatsType,
  GetNearestItemsInputType,
} from "../types";
import { GetImdbDetailsById } from "../../parse/services";
import { GetEmbedding } from "../../open-ai/services";
import { UploadImageByUrl, UploadImageByBase64, DeleteFile } from "../../files/files.service";
import { GetAnilistDetailsById } from "../../parse/services/anilist.service";
import {
  UpdateItemEmbedding,
  GetItemEmbedding,
  GetNearestItemsIds,
} from "./item-embedding.service";
import type { SearchItemByTextInputSchema } from "../types/search-item-by-text-input.type";
import { ItemResponseClass } from "../item-response.class";
import {
  getUserItemsDateStats,
  getUserItemsRateStats,
  getUserItemsStatusStats,
} from "./item-stats.service";

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

      const collection = await prisma.collection.findUnique({
        where: {
          id: collectionId,
        },
      });

      if (!collection) {
        throw new Error("Collection not found!");
      }

      const image = await UploadImageByUrl(collection.name, details.image);

      const item = await prisma.item.create({
        data: {
          collectionId: collection.id,
          title: details.title,
          year: details.year,
          description: details.description,
          parsedId,
          image,
        },
      });

      const keys = Object.keys(details);

      const fieldGroups = await prisma.fieldGroup.findMany({
        where: {
          name: {
            in: keys,
          },
          collections: {
            some: {
              id: collection.id,
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
}): Promise<ItemType[]> {
  const { ctx, input } = props;

  const limit = input.limit ?? 20;
  const page = input.page ?? 1;
  const rates = input.filtering?.filter((f) => f.name === "rate") ?? [];
  const statuses = input.filtering?.filter((f) => f.name === "status") ?? [];
  const years = input.filtering?.filter((f) => f.name === "year") ?? [];
  const fields = input.filtering?.filter((f) => f.name === "field") ?? [];
  const tags = input.filtering?.filter((f) => f.name === "tag") ?? [];

  const rateFromFilter = rates.find((f) => f.type === "from");
  const rateToFilter = rates.find((f) => f.type === "to");
  const yearFromFilter = years.find((f) => f.type === "from");
  const yearToFilter = years.find((f) => f.type === "to");
  const statusIncludeFilter = statuses.filter((f) => f.type === "include");
  const statusExcludeFilter = statuses.filter((f) => f.type === "exclude");
  const includeFieldsIds = fields
    .filter((f) => f.type === "include")
    .map((f) => f.fieldId);
  const excludeFieldsIds = fields
    .filter((f) => f.type === "exclude")
    .map((f) => f.fieldId);
  const includeTagIds = tags
    .filter((f) => f.type === "include")
    .map((f) => f.tagId);
  const excludeTagIds = tags
    .filter((f) => f.type === "exclude")
    .map((f) => f.tagId);

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

      ...(includeTagIds.length && {
        AND: includeTagIds.map((tagId) => ({
          tags: {
            some: {
              id: tagId,
            },
          },
        })),
      }),
      ...(excludeTagIds.length && {
        tags: {
          none: {
            id: {
              in: excludeTagIds,
            },
          },
        },
      }),

      item: {
        ...(input.search && {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        }),
        ...(input.collectionsIds?.length && {
          collectionId: {
            in: input.collectionsIds,
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

    ...(input.sorting && {
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
        orderBy: [{ status: input.sorting.type }, { item: { title: "asc" } }],
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

  return ItemResponse.transformUserItems(userItems);
}

export async function GetAllUserItems(props: {
  ctx: ContextType;
  input: GetAllUserItemsInputType;
}): Promise<TierItemType[]> {
  const { ctx, input } = props;

  const rates = input.filtering?.filter((f) => f.name === "rate") ?? [];
  const statuses = input.filtering?.filter((f) => f.name === "status") ?? [];
  const years = input.filtering?.filter((f) => f.name === "year") ?? [];
  const fields = input.filtering?.filter((f) => f.name === "field") ?? [];
  const tags = input.filtering?.filter((f) => f.name === "tag") ?? [];

  const rateFromFilter = rates.find((f) => f.type === "from");
  const rateToFilter = rates.find((f) => f.type === "to");
  const yearFromFilter = years.find((f) => f.type === "from");
  const yearToFilter = years.find((f) => f.type === "to");
  const statusIncludeFilter = statuses.filter((f) => f.type === "include");
  const statusExcludeFilter = statuses.filter((f) => f.type === "exclude");
  const includeFieldsIds = fields
    .filter((f) => f.type === "include")
    .map((f) => f.fieldId);
  const excludeFieldsIds = fields
    .filter((f) => f.type === "exclude")
    .map((f) => f.fieldId);
  const includeTagIds = tags
    .filter((f) => f.type === "include")
    .map((f) => f.tagId);
  const excludeTagIds = tags
    .filter((f) => f.type === "exclude")
    .map((f) => f.tagId);

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

      ...(includeTagIds.length && {
        AND: includeTagIds.map((tagId) => ({
          tags: {
            some: {
              id: tagId,
            },
          },
        })),
      }),
      ...(excludeTagIds.length && {
        tags: {
          none: {
            id: {
              in: excludeTagIds,
            },
          },
        },
      }),

      item: {
        ...(input.search && {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        }),
        ...(input.collectionsIds?.length && {
          collectionId: {
            in: input.collectionsIds,
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

    ...(input.sorting && {
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
        orderBy: [{ status: input.sorting.type }, { item: { title: "asc" } }],
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
  });

  return ItemResponse.transformTierItems(userItems);
}

export async function GetUserItemsStats(props: {
  ctx: ContextType;
  input: GetUserItemsStatsInputType;
}): Promise<ItemsStatsType> {
  const { ctx, input } = props;

  const date = await getUserItemsDateStats({
    ctx,
    collectionsIds: input,
  });
  const rate = await getUserItemsRateStats({
    ctx,
    collectionsIds: input,
  });
  const status = await getUserItemsStatusStats({
    ctx,
    collectionsIds: input,
  });

  const all = await ctx.db.userToItem.count({
    where: {
      userId: ctx.session.user.id,
      ...(input.length && {
        item: {
          collectionId: {
            in: input,
          },
        },
      }),
    },
  });

  return {
    date,
    rate,
    status,
    all,
  };
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
        include: {
          collection: true,
          fields: true,
        },
      },
      tags: true,
    },
  });

  if (!userItem) {
    return null;
  }

  return ItemResponse.transformUserItem(userItem);
}

export async function GetNearestItems(props: {
  ctx: ContextType;
  input: GetNearestItemsInputType;
}): Promise<ItemType[]> {
  const { ctx, input } = props;

  const itemEmbedding = await GetItemEmbedding({
    ctx,
    itemId: input.itemId,
  });

  const nearestItemsIds = await GetNearestItemsIds({
    ctx,
    embedding: itemEmbedding,
    limit: input.limit,
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
      ...(input.length && {
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

  return "Item updated successfully!";
}

export async function UpdateItemImage(props: {
  ctx: ContextType;
  input: UpdateItemImageInputType;
}): Promise<string> {
  const { ctx, input } = props;

  // Check if user owns this item
  const userItem = await ctx.db.userToItem.findUnique({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input.id,
      },
    },
    include: {
      item: {
        include: {
          collection: true,
        },
      },
    },
  });

  if (!userItem) {
    throw new Error("Item not found!");
  }

  const { item } = userItem;
  const oldImage = item.image;

  // Upload new image
  let newImageId: string | null = null;

  if (input.imageUrl) {
    newImageId = await UploadImageByUrl(item.collection.name, input.imageUrl);
  } else if (input.imageBase64) {
    newImageId = await UploadImageByBase64(
      item.collection.name,
      input.imageBase64,
    );
  }

  if (!newImageId) {
    throw new Error("Failed to upload image");
  }

  // Delete old image from Cloudinary if exists
  if (oldImage) {
    await DeleteFile(item.collection.name, oldImage);
  }

  // Update item image in database
  await ctx.db.item.update({
    where: {
      id: input.id,
    },
    data: {
      image: newImageId,
    },
  });

  return "Item image updated successfully!";
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
}): Promise<ItemType[]> {
  const { ctx, input } = props;

  const limit = input.limit ?? 12;

  const rates = input.filtering?.filter((f) => f.name === "rate") ?? [];
  const statuses = input.filtering?.filter((f) => f.name === "status") ?? [];
  const years = input.filtering?.filter((f) => f.name === "year") ?? [];
  const fields = input.filtering?.filter((f) => f.name === "field") ?? [];
  const tags = input.filtering?.filter((f) => f.name === "tag") ?? [];

  const rateFromFilter = rates.find((f) => f.type === "from");
  const rateToFilter = rates.find((f) => f.type === "to");
  const yearFromFilter = years.find((f) => f.type === "from");
  const yearToFilter = years.find((f) => f.type === "to");
  const statusIncludeFilter = statuses.filter((f) => f.type === "include");
  const statusExcludeFilter = statuses.filter((f) => f.type === "exclude");
  const includeFieldsIds = fields
    .filter((f) => f.type === "include")
    .map((f) => f.fieldId);
  const excludeFieldsIds = fields
    .filter((f) => f.type === "exclude")
    .map((f) => f.fieldId);
  const includeTagIds = tags
    .filter((f) => f.type === "include")
    .map((f) => f.tagId);
  const excludeTagIds = tags
    .filter((f) => f.type === "exclude")
    .map((f) => f.tagId);

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

      ...(includeTagIds.length && {
        AND: includeTagIds.map((tagId) => ({
          tags: {
            some: {
              id: tagId,
            },
          },
        })),
      }),
      ...(excludeTagIds.length && {
        tags: {
          none: {
            id: {
              in: excludeTagIds,
            },
          },
        },
      }),

      item: {
        ...(input.collectionsIds?.length && {
          collectionId: {
            in: input.collectionsIds,
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

  console.log("Finished");
}

// #endregion public functions
