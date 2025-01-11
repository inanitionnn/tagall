import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  AddTagInputSchema,
  DeleteTagInputSchema,
  GetUserTagsInputSchema,
  UpdateTagInputSchema,
} from "./schemas";
import { AddTag, DeleteTag, GetUserTags, UpdateTag } from "./services";

export const TagRouter = createTRPCRouter({
  getUserTags: protectedProcedure
    .input(GetUserTagsInputSchema)
    .query(GetUserTags),

  addTag: protectedProcedure.input(AddTagInputSchema).mutation(AddTag),

  updateTag: protectedProcedure.input(UpdateTagInputSchema).mutation(UpdateTag),

  deleteTag: protectedProcedure.input(DeleteTagInputSchema).mutation(DeleteTag),
});
