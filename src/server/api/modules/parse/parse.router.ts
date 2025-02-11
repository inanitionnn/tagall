import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AddIdToSearchResults, Search } from "./services";
import { SearchInputSchema } from "./schemas";
import { getOrSetCache } from "../../../../lib";

export const ParseRouter = createTRPCRouter({
  search: protectedProcedure.input(SearchInputSchema).query(async (props) => {
    const { input } = props;
    const response = await getOrSetCache(Search(props), "parse", "search", {
      input,
    });
    return AddIdToSearchResults({ ...props, items: response });
  }),
});
