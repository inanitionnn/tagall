import { ContextType } from "../../../../types";
import { SearchInputType } from "../types";
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
  switch (collection.name) {
    case "Film":
      return SearchImdb(input.query, "film");
    case "Serie":
      return SearchImdb(input.query, "series");
    default:
      throw new Error("Invalid collection name");
  }
};
