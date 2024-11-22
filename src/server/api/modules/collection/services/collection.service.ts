import { ContextType } from "../../../../types";

export const GetAll = async (props: { ctx: ContextType }) => {
  const { ctx } = props;
  return ctx.db.collection.findMany({
    orderBy: [{ priority: "asc" }],
  });
};
