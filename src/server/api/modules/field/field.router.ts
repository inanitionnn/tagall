import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetFilterFieldsInputSchema } from "./schemas";
import { GetFilterFields } from "./services";

export const FieldRouter = createTRPCRouter({
  getFilterFields: protectedProcedure
    .input(GetFilterFieldsInputSchema)
    .query(GetFilterFields),
});
