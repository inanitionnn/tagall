import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetAll } from "./services";

export const CollectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(GetAll),
});
