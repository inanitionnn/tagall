import { ContextType } from "../../../../types";
import { SearchInputType, SearchResultType } from "../types";
import { SearchImdb } from "./imdb.service";

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
      const result = await SearchImdb(input.query, "film", input.limit);
      items = result
        .map((item) => {
          const parsedId = item.link?.match(/\/title\/(tt\d+)/)?.[1];
          if (parsedId) {
            return {
              ...item,
              parsedId,
              inCollection: false,
            };
          }
          return null;
        })
        .filter(Boolean) as SearchResultType[];
      break;
    }
    case "Serie": {
      const result = await SearchImdb(input.query, "series", input.limit);
      items = result
        .map((item) => {
          const parsedId = item.link?.match(/\/title\/(tt\d+)/)?.[1];
          if (parsedId) {
            return {
              ...item,
              parsedId,
              inCollection: false,
            };
          }
          return null;
        })
        .filter(Boolean) as SearchResultType[];
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
