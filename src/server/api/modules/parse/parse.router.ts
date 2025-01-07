import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Search } from "./services";
import { SearchInputSchema } from "./schemas";

export const ParseRouter = createTRPCRouter({
  search: protectedProcedure.input(SearchInputSchema).query(Search),
});
