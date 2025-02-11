import type { Field, Item, UserToItem, Collection, Tag } from "@prisma/client";
import type { ItemType } from "./types";
import { FieldsToData } from "../field/services";
import type { ContextType } from "../../../types";
import { dateToTimeAgoString } from "../../../../lib";

type UserItemSmallType = UserToItem & {
  tags: Tag[];
  item: Item & {
    collection: Collection;
  };
};

export class ItemResponseClass {
  public transformUserItem(userItem: UserItemSmallType): ItemType {
    return {
      id: userItem.item.id,
      title: userItem.item.title,
      description: userItem.item.description,
      year: userItem.item.year,
      image: userItem.item.image,
      rate: userItem.rate,
      status: userItem.status,
      timeAgo: dateToTimeAgoString(userItem.updatedAt),
      updatedAt: userItem.updatedAt,
      collection: {
        id: userItem.item.collection.id,
        name: userItem.item.collection.name,
      },
      tags: userItem.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }

  public transformUserItems(userItems: UserItemSmallType[]): ItemType[] {
    return userItems.map((userItem) => this.transformUserItem(userItem));
  }

  public async transformItemDetails(props: {
    ctx: ContextType;
    item: Item & {
      collection: Collection;
      fields: Field[];
    };
  }) {
    const { ctx, item } = props;
    const fieldsToData = await FieldsToData({
      ctx,
      fields: item.fields,
    });
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      year: item.year,
      collection: item.collection.name,
      ...fieldsToData,
    };
  }
}
