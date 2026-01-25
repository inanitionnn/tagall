import type { ContextType } from "../../../../types";
import type { SearchInputType, SearchResultType } from "../types";
import { SearchAnilist } from "./anilist.service";
import { SearchImdb } from "./imdb.service";

export const AddIdToSearchResults = async (props: {
  ctx: ContextType;
  items: SearchResultType[];
}) => {
  const { ctx, items } = props;

  const userItems = await ctx.db.userToItem.findMany({
    where: {
      userId: ctx.session.user.id,
      item: {
        parsedId: {
          in: items.map((item) => item.parsedId),
        },
      },
    },
    select: {
      item: {
        select: {
          id: true,
          parsedId: true,
        },
      },
    },
  });

  const itemsMap = userItems.reduce(
    (acc, userItem) => {
      acc[userItem.item.parsedId] = userItem.item.id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return items.map((item) => {
    return {
      ...item,
      id: itemsMap[item.parsedId] ?? null,
    };
  });
};

export const Search = async (props: {
  ctx: ContextType;
  input: SearchInputType;
}) => {
  const { ctx, input } = props;

  const collection = await ctx.db.collection.findUnique({
    where: { id: input.collectionId },
  });
  if (!collection) {
    throw new Error("Collection not found");
  }

  let items: SearchResultType[] = [];
  switch (collection.name) {
    case "Film":
      items = await SearchImdb({
        query: input.query,
        type: "film",
        limit: input.limit,
        isQuickSearch: input.isAdvancedSearch,
      });
      break;
    case "Serie":
      items = await SearchImdb({
        query: input.query,
        type: "series",
        limit: input.limit,
        isQuickSearch: input.isAdvancedSearch,
      });
      break;
    case "Manga":
      items = await SearchAnilist(input.query, input.limit);
      break;
    default:
      throw new Error("Collection not found");
  }

  return items;
};
