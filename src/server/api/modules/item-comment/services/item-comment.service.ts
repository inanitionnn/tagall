import type { ContextType } from '../../../../types';
import type {
  AddItemCommentInputType,
  DeleteItemCommentInputType,
  UpdateItemCommentInputType,
} from '../types';

export async function AddItemComment(props: {
  ctx: ContextType;
  input: AddItemCommentInputType;
}) {
  const { ctx, input } = props;

  const item = await ctx.db.item.findUnique({
    where: { id: input.itemId },
  });

  if (!item) {
    throw new Error('Item not found');
  }

  const userToItem = await ctx.db.userToItem.findUnique({
    where: {
      userId_itemId: {
        userId: ctx.session.user.id,
        itemId: input.itemId,
      },
    },
  });

  if (!userToItem) {
    throw new Error('Item not found in your collection!');
  }

  await ctx.db.item.update({
    where: {
      id: input.itemId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  await ctx.db.itemComment.create({
    data: {
      title: input.title,
      description: input.description,
      userToItemId: userToItem.id,
      rate: input.rate ? input.rate : null,
      status: input.status,
    },
  });

  return 'Comment created successfully!';
}

export async function UpdateItemComment(props: {
  ctx: ContextType;
  input: UpdateItemCommentInputType;
}) {
  const { ctx, input } = props;

  const itemComment = await ctx.db.itemComment.findUnique({
    where: {
      id: input.id,
    },
    include: {
      userToItem: true,
    },
  });

  if (!itemComment) {
    throw new Error('Comment not found!');
  }

  await ctx.db.item.update({
    where: {
      id: itemComment.userToItem.itemId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  await ctx.db.itemComment.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title,
      description: input.description,
      rate: input.rate,
      status: input.status,
    },
  });

  return 'Comment updated successfully!';
}

export async function DeleteItemComment(props: {
  ctx: ContextType;
  input: DeleteItemCommentInputType;
}) {
  const { ctx, input } = props;

  const itemComment = await ctx.db.itemComment.findUnique({
    where: {
      id: input,
    },
    include: {
      userToItem: true,
    },
  });

  if (!itemComment) {
    throw new Error('Comment not found!');
  }

  await ctx.db.item.update({
    where: {
      id: itemComment.userToItem.itemId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  await ctx.db.itemComment.delete({
    where: {
      id: input,
    },
  });

  return 'Comment deleted successfully!';
}

// #endregion public functions
