import type { ContextType } from "../../../../types";
import type { SearchInputType, SearchResultType } from "../types";
import { AdvancedSearchImdb } from "./imdb.service";

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
    case "Film": {
      items = await AdvancedSearchImdb(input.query, "film", input.limit);
      break;
    }
    case "Serie": {
      items = await AdvancedSearchImdb(input.query, "series", input.limit);
      break;
    }
    default:
      throw new Error("Invalid collection name");
  }
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
          parsedId: true,
        },
      },
    },
  });

  const parseIdsSet = new Set(
    userItems.map((userItem) => userItem.item.parsedId),
  );

  return items.map((item) => {
    return {
      ...item,
      inCollection: parseIdsSet.has(item.parsedId),
    };
  });
};
