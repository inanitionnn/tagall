import type { ContextType } from "../../../../types";

export const GetAll = async (props: { ctx: ContextType }) => {
  const { ctx } = props;
  return ctx.db.collection.findMany({
    orderBy: [{ priority: "asc" }],
  });
};

export const GetUserCollections = async (props: { ctx: ContextType }) => {
  const { ctx } = props;

  return ctx.db.collection.findMany({
    where: {
      items: {
        some: {
          userToItems: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    },
    orderBy: [{ priority: "asc" }],
  });
};
