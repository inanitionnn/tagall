import type { ItemComment } from "@prisma/client";
import type { CommentType } from "./types";
import { dateToTimeAgoString } from "../../../../lib";

export class ItemCommentResponseClass {
  public transformUserItemComment(itemComment: ItemComment): CommentType {
    return {
      id: itemComment.id,
      title: itemComment.title,
      description: itemComment.description,
      rate: itemComment.rate,
      status: itemComment.status,
      isSpoiler: itemComment.isSpoiler,
      private: itemComment.private,
      timeAgo: dateToTimeAgoString(itemComment.createdAt),
      createdAt: itemComment.createdAt,
    };
  }

  public transformUserItemComments(itemComments: ItemComment[]): CommentType[] {
    return itemComments.map((itemComment) =>
      this.transformUserItemComment(itemComment),
    );
  }
}
