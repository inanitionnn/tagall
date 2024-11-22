import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetAll } from "./services";

export const collectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(GetAll),
});
