import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetFilterFieldsInputSchema } from "./schemas";
import { GetFilterFields } from "./services";
import { getOrSetCache } from "../../../../lib";

export const FieldRouter = createTRPCRouter({
  getFilterFields: protectedProcedure
    .input(GetFilterFieldsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const response = await getOrSetCache(
        GetFilterFields(props),
        "field",
        "getFilterFields",
        {
          userId: ctx.session.user.id,
          input,
        },
      );
      return response;
    }),
});
