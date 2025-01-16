import type {
  Field,
  FieldGroup,
  ItemComment,
  Item,
  UserToItem,
  Collection,
  Tag,
} from "@prisma/client";
import type { ContextType } from "../../../types";
import type { ItemSmallType, ItemType } from "./types";

type UserItemType = UserToItem & {
  tags: Tag[];
  itemComments: ItemComment[];
  item: Item & {
    collection: Collection;
    fields: Field[];
  };
};

type UserItemSmallType = UserToItem & {
  tags: Tag[];
  item: Item & {
    collection: Collection;
  };
};

export class ItemResponseClass {
  private async getFieldIdToFieldGroupIdMap(ctx: ContextType) {
    const fields = await ctx.db.field.findMany({
      select: {
        id: true,
        fieldGroup: {
          select: {
            id: true,
            name: true,
            priority: true,
          },
        },
      },
    });

    const fieldMap = fields.reduce(
      (acc, field) => {
        acc[field.id] = field.fieldGroup;
        return acc;
      },
      {} as Record<string, Omit<FieldGroup, "isFiltering">>,
    );

    return fieldMap;
  }

  private fieldsToGroupedFields(
    fields: Field[],
    fieldIdToFieldGroupMap: Record<string, Omit<FieldGroup, "isFiltering">>,
  ) {
    const groupedFields: Record<
      string,
      {
        name: string;
        priority: number;
        fields: string[];
      }
    > = {};

    fields.forEach((field) => {
      const fieldGroup = fieldIdToFieldGroupMap[field.id];

      if (!fieldGroup) {
        throw new Error(`FieldGroup not found for field ID: ${field.id}`);
      }

      const { id: groupId, name: groupName, priority } = fieldGroup;

      if (!groupedFields[groupId]) {
        groupedFields[groupId] = {
          name: groupName,
          priority,
          fields: [],
        };
      }

      groupedFields[groupId].fields.push(field.value);
    });

    return Object.values(groupedFields)
      .sort((a, b) => a.priority - b.priority)
      .map((group) => ({
        name: group.name,
        fields: [...new Set(group.fields)],
      }));
  }

  private dateToTimeAgoString(date: Date) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "week", seconds: 604800 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 },
    ];

    for (const unit of units) {
      const interval = Math.floor(diff / unit.seconds);
      if (interval > 0) {
        return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

  private transformSmall(userItem: UserItemSmallType): ItemSmallType {
    return {
      id: userItem.item.id,
      title: userItem.item.title,
      description: userItem.item.description,
      year: userItem.item.year,
      image: userItem.item.image,
      rate: userItem.rate,
      status: userItem.status,
      timeAgo: this.dateToTimeAgoString(userItem.updatedAt),
      updatedAt: userItem.updatedAt,
      collection: userItem.item.collection,
      tags: userItem.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }

  public transformItems(userItems: UserItemSmallType[]): ItemSmallType[] {
    return userItems.map((userItem) => this.transformSmall(userItem));
  }

  public async transformItem(props: {
    ctx: ContextType;
    userItem: UserItemType;
    similarUserItems: UserItemSmallType[];
  }): Promise<ItemType> {
    const { ctx, userItem, similarUserItems } = props;
    const FieldIdToFieldGroupIdMap =
      await this.getFieldIdToFieldGroupIdMap(ctx);
    return {
      id: userItem.item.id,
      title: userItem.item.title,
      description: userItem.item.description,
      year: userItem.item.year,
      image: userItem.item.image,
      rate: userItem.rate,
      status: userItem.status,
      timeAgo: this.dateToTimeAgoString(userItem.updatedAt),
      updatedAt: userItem.updatedAt,
      collection: userItem.item.collection,
      fieldGroups: this.fieldsToGroupedFields(
        userItem.item.fields,
        FieldIdToFieldGroupIdMap,
      ),
      tags: userItem.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      comments: userItem.itemComments.map((comment) => ({
        id: comment.id,
        title: comment.title,
        description: comment.description,
        rate: comment.rate,
        status: comment.status,
        timeAgo: this.dateToTimeAgoString(comment.createdAt),
        createdAt: comment.createdAt,
      })),
      similarItems: similarUserItems.map((userItem) =>
        this.transformSmall(userItem),
      ),
    };
  }
}
