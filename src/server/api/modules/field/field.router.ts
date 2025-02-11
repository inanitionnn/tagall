import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  GetFilterFieldsInputSchema,
  GetItemDetailFieldsInputSchema,
} from "./schemas";
import { GetFilterFields, GetItemDetailFields } from "./services";
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

  getItemDetailFields: protectedProcedure
    .input(GetItemDetailFieldsInputSchema)
    .query(async (props) => {
      const { input } = props;
      const response = await getOrSetCache(
        GetItemDetailFields(props),
        "field",
        "getItemDetailFields",
        {
          input,
        },
      );
      return response;
    }),
});
