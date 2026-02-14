import type { Field, FieldGroup } from "@prisma/client";
import type { ContextType } from "../../../../types";
import type {
  FilterFieldsType,
  FieldToFieldGroupMapType,
  GetFilterFieldsInputType,
  GetItemDetailFieldsInputType,
} from "../types";

const GetFieldToFieldGroupMap = async (
  ctx: ContextType,
): Promise<FieldToFieldGroupMapType> => {
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
};

const FieldsToGroupedFields = (
  fields: Field[],
  fieldIdToFieldGroupMap: Record<string, Omit<FieldGroup, "isFiltering">>,
) => {
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
};

export const FieldsToData = async (props: {
  ctx: ContextType;
  fields: Field[];
}) => {
  const { ctx, fields } = props;
  const FieldIdToFieldGroupIdMap = await GetFieldToFieldGroupMap(ctx);
  const groupedFields = FieldsToGroupedFields(fields, FieldIdToFieldGroupIdMap);

  const fieldData: Record<string, any[]> = {};
  groupedFields.forEach((group) => {
    fieldData[group.name] = group.fields;
  });
  return fieldData;
};

export const GetFilterFields = async (props: {
  ctx: ContextType;
  input: GetFilterFieldsInputType;
}): Promise<FilterFieldsType[]> => {
  const { ctx, input } = props;
  const MINIMUM_ITEMS = 3 as const;

  const fields = await ctx.db.field.findMany({
    select: {
      id: true,
      fieldGroup: {
        select: {
          collections: true,
          isFiltering: true,
        },
      },
      _count: {
        select: {
          items: {
            where: {
              collectionId: {
                in: input,
              },
            },
          },
        },
      },
    },
  });

  const fieldsIdsWithMinimumItems = fields
    .filter((field) => field._count.items >= MINIMUM_ITEMS)
    .map((field) => field.id);

  const fieldGroups = await ctx.db.fieldGroup.findMany({
    where: {
      isFiltering: true,
      ...(input.length && {
        collections: {
          some: {
            id: {
              in: input,
            },
          },
        },
      }),
    },
    select: {
      id: true,
      name: true,
      priority: true,
      fields: {
        where: {
          id: {
            in: fieldsIdsWithMinimumItems,
          },
        },
        orderBy: {
          value: "asc",
        },
        select: {
          id: true,
          value: true,
        },
      },
      _count: {
        select: { fields: true },
      },
    },
    orderBy: {
      priority: "asc",
    },
  });

  return fieldGroups.filter((fieldGroup) => fieldGroup._count.fields > 0);
};

export const GetItemDetailFields = async (props: {
  ctx: ContextType;
  input: GetItemDetailFieldsInputType;
}) => {
  const { ctx } = props;

  const fields = await ctx.db.field.findMany({
    where: {
      items: {
        some: {
          id: props.input,
        },
      },
    },
  });

  return FieldsToData({ ctx, fields });
};
