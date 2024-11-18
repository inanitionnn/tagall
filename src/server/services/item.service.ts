import { PrismaClient } from "@prisma/client";
import { getImdbDetailsById } from "./imdb.service";
import { DefaultArgs } from "@prisma/client/runtime/library";

// #region private functions
type GetHtmlFromUrlProps = {
  ctx: {
    db: PrismaClient<
      {
        log: ("query" | "warn" | "error")[];
      },
      never,
      DefaultArgs
    >;
  };
  id: string;
  collectionId: string;
};
export async function createImdbItem(props: GetHtmlFromUrlProps) {
  const { ctx, id, collectionId } = props;

  const oldItem = await ctx.db.item.findFirst({
    where: {
      parsedId: id,
    },
  });

  if (oldItem) {
    return oldItem;
  }

  const details = await getImdbDetailsById(id);
  if (!details.title) {
    throw new Error("Imdb parse error! Title not found!");
  }
  const item = await ctx.db.item.create({
    data: {
      collectionId: collectionId,
      name: details.title,
      parsedId: id,
      image: details.image,
    },
  });
  for (const [key, value] of Object.entries(details)) {
    if (key === "title" || key === "image") {
      continue;
    }
    const fieldGroup = await ctx.db.fieldGroup.findFirst({
      where: {
        name: key,
        collections: {
          some: {
            id: collectionId,
          },
        },
      },
    });
    if (!fieldGroup) {
      continue;
    }
    switch (typeof value) {
      case "string": {
        if (fieldGroup.isNumber) {
          continue;
        }
        await ctx.db.field.upsert({
          where: {
            value: value,
          },
          create: {
            value: value,
            fieldGroupId: fieldGroup.id,
            items: {
              connect: {
                id: item.id,
              },
            },
          },
          update: {
            items: {
              connect: {
                id: item.id,
              },
            },
          },
        });
        break;
      }
      case "number": {
        await ctx.db.field.upsert({
          where: {
            value: value.toString(),
          },
          create: {
            value: value.toString(),
            fieldGroupId: fieldGroup.id,
            items: {
              connect: {
                id: item.id,
              },
            },
          },
          update: {
            items: {
              connect: {
                id: item.id,
              },
            },
          },
        });
        break;
      }
      case "object": {
        if (!Array.isArray(value) || fieldGroup.isNumber) {
          continue;
        }
        for (const field of value) {
          await ctx.db.field.upsert({
            where: {
              value: field,
            },
            create: {
              value: field,
              fieldGroupId: fieldGroup.id,
              items: {
                connect: {
                  id: item.id,
                },
              },
            },
            update: {
              items: {
                connect: {
                  id: item.id,
                },
              },
            },
          });
        }

        break;
      }
    }
  }
  return item;
}
// #endregion private functions
