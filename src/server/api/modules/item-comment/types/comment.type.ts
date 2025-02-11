import type { ItemComment } from "@prisma/client";

export type CommentType = Omit<ItemComment, "userToItemId" | "updatedAt"> & {
  timeAgo: string;
};
