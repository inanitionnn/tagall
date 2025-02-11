import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetAll, GetUserCollections } from "./services";
import { getOrSetCache } from "../../../../lib";

export const CollectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async (props) => {
    const response = await getOrSetCache(GetAll(props), "collection", "getAll");
    return response;
  }),
  getUserCollections: protectedProcedure.query(async (props) => {
    const { ctx } = props;
    const response = await getOrSetCache(
      GetUserCollections(props),
      "collection",
      "getUserCollections",
      {
        userId: ctx.session.user.id,
      },
    );
    return response;
  }),
});
